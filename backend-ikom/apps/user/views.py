from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import TokenError
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser
from django.core.files import File
from django.conf import settings

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from apps.user.serializers import UserSerializer, LoginSerializer, RegisterSerializer
from apps.user.models import User

from dotenv import load_dotenv
from uuid import uuid4
from helpers.image_recognition import face_recognition_save, image_to_text, compare_faces
from helpers.fonctions import parse_cin_text
from datetime import datetime
import traceback
import os, re,tempfile

load_dotenv()


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Récupérer le profil de l'utilisateur connecté",
        tags=["User"],
        responses={
            200: openapi.Response(
                description="Profil récupéré avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
                        "name": openapi.Schema(type=openapi.TYPE_STRING, example="John Doe"),
                        "email": openapi.Schema(type=openapi.TYPE_STRING, example="user@example.com"),
                        "sexe": openapi.Schema(type=openapi.TYPE_STRING, example="M"),
                        "cin_number": openapi.Schema(type=openapi.TYPE_STRING, example="201031521256"),
                        "birth_date": openapi.Schema(type=openapi.TYPE_STRING, format="date", example="1990-01-01"),
                        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                    },
                ),
            ),
            403: openapi.Response(
                description="Accès refusé: votre compte doit être actif.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Accès refusé: votre compte doit être actif. Veuillez vous connecter pour continuer."),
                    },
                ),
            ),
        },
        security=[{'Bearer': []}],
    )
    
    def get(self, request:Request):
        serializer = UserSerializer(request.user, context={'request': request})
        user = serializer.data
        if not user['is_active']:
            return Response({'error': 'Accès refusé: votre compte doit être actif. Veuillez vous connecter pour continuer.'}, status=403)
        return Response(user, status=200)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Déconnexion de l'utilisateur",
        tags=["User"],
        responses={
            200: openapi.Response(
                description="Utilisateur déconnecté",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Utilisateur déconnecté avec succès.")
                    },
                ),
            ),
            404: openapi.Response(
                description="Utilisateur non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "erreur": openapi.Schema(type=openapi.TYPE_STRING, example="Utilisateur non trouvé")
                    },
                ),
            ),
        },
        security=[{'Bearer': []}],
    )

    def put(self, request:Request):
        try:
            user = User.objects.get(id=request.user.id)
            user.is_active = False
            user.save()
            return Response({'message':'Utilisateur déconnecté avec succès.'}, status=200)
        except User.DoesNotExist:
            return Response({'erreur':"Utilisateur non trouvé"}, status=404)

class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    @swagger_auto_schema(
        operation_description="Connexion d'un modérateur ou professeur via email et mot de passe",
        tags=["User"],
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Connexion réussie",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "access": openapi.Schema(type=openapi.TYPE_STRING, example="eyJhbGciOiJIUzI1..."),
                        "name": openapi.Schema(type=openapi.TYPE_STRING, example="John Doe"),
                        "sexe": openapi.Schema(type=openapi.TYPE_STRING, example="M"),
                        "user_type": openapi.Schema(type=openapi.TYPE_STRING, example="MODERATOR"),
                    },
                ),
            ),
            400: openapi.Response(
                description="Erreur de validation des identifiants",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "erreur": openapi.Schema(type=openapi.TYPE_STRING, example="Identifiants invalides"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer 
    authentication_classes= []
    
    def check_if_user_exist(self, email):
        return User.objects.filter(email=email).exists()
    
    def validate_data(self, data):
        try:
            keys = ['name', 'email', 'password', 'sexe', 'birth_date']
            if any(key not in data.keys() for key in keys):
                return False
            return True
        except Exception as e:
            return False
    
    @swagger_auto_schema(
        operation_description="Inscription d'un modérateur ou professeur",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
                'sexe': openapi.Schema(type=openapi.TYPE_STRING, enum=['M', 'F', 'I']),
                'birth_date': openapi.Schema(type=openapi.TYPE_STRING, format='date'),
                'cin_number': openapi.Schema(type=openapi.TYPE_STRING, default=''),
            },
            required=['name', 'email', 'password', 'sexe', 'birth_date']
        ),
        tags=["User"],
        responses={
            201: openapi.Response(
                description="Utilisateur créé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "email": openapi.Schema(type=openapi.TYPE_STRING, example="user@example.com"),
                    },
                ),
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "erreur": openapi.Schema(type=openapi.TYPE_STRING, example="email existant"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        try:
            user_data = request.data
            if not self.validate_data(user_data):
                return Response({'erreur': 'Tous les attributs sont requis'}, status=status.HTTP_400_BAD_REQUEST)
            
            if self.check_if_user_exist(request.data['email']):
                return Response({'erreur': 'email existant'}, status=400)
            
            user_data['birth_date'] = request.data['birth_date'].replace('/', '-')
            user_data['user_type'] = "MODERATOR"
            user_data['handicap_type'] = "AUCUN"
            user_data['is_staff'] = True
            
            if user_data.get('sexe', 'I').lower() not in ['masculin', 'feminin']:
                user_data['sexe'] = 'I'
            else:
                user_data['sexe'] = user_data['sexe'].strip()[0].upper()
            
            serializer = RegisterSerializer(data=user_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"email": serializer.validated_data["email"]}, status=status.HTTP_201_CREATED)
            else:
                return Response({'erreur': 'erreur de serialisation'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(traceback.format_exc())
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterFaceView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    parser_classes = [MultiPartParser]
    
    def check_if_user_exist(self, email):
        return User.objects.filter(email=email).exists()
    
    def validate_data(self, data, files):
        try:
            required_keys = ['email']
            required_files = ['cin_image', 'face_image']
            if any(key not in data.keys() for key in required_keys):
                return False, "Missing required fields: email"
            if any(file not in files.keys() for file in required_files):
                return False, "Missing required files: cin_image, face_image"
            email = data['email']
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return False, "Invalid email format"
            if 'handicap_type' in data:
                valid_handicap_types = [choice[0] for choice in User.HANDICAP_TYPE]
                if data['handicap_type'] not in valid_handicap_types:
                    return False, f"Invalid handicap_type. Must be one of: {valid_handicap_types}"
            return True, ""
        except Exception as e:
            return False, str(e)
    
    def process_cin_image(self, cin_image, directory_to_save="media/cin_images"):
        temp_path = None
        try:
            temp_path = os.path.join(directory_to_save, "temp_cin.jpg")
            if not os.path.exists(directory_to_save):
                os.makedirs(directory_to_save)
            
            with open(temp_path, 'wb') as f:
                f.write(cin_image.read())
            text = image_to_text(temp_path)
            if not text:
                return None, None, "Failed to extract text from CIN image"
            cin_data = parse_cin_text(text)
            return cin_data, temp_path, None
        except Exception as e:
            return None, None, str(e)
    
    def process_face_image(self, face_image, directory_to_save="media/faces"):
        temp_path = None
        try:
            temp_path = os.path.join("media/temp", "temp_face.jpg")
            if not os.path.exists("media/temp"):
                os.makedirs("media/temp")
                
            with open(temp_path, 'wb') as f:
                f.write(face_image.read())
            
            saved_face_path = face_recognition_save(
                temp_path,
                directory_to_save,
                f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            )
            
            if not saved_face_path:
                return None, None, "Failed to detect and save face"
            
            django_file = File(open(saved_face_path, 'rb'), name=os.path.basename(saved_face_path))
            return django_file, saved_face_path, None
        except Exception as e:
            return None, None, str(e)
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    @swagger_auto_schema(
        operation_description="Inscription d'un utilisateur handicapé avec CIN et photo de visage (multipart/form-data)",
        manual_parameters=[
            openapi.Parameter(
                'email',
                openapi.IN_FORM,
                description="Adresse email de l'utilisateur",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'sexe',
                openapi.IN_FORM,
                description="Sexe de l'utilisateur (M/F/I)",
                type=openapi.TYPE_STRING,
                enum=['M', 'F', 'I'],
                default="I"
            ),
            openapi.Parameter(
                'cin_image',
                openapi.IN_FORM,
                description="Image de la carte CIN",
                type=openapi.TYPE_FILE,
                required=True
            ),
            openapi.Parameter(
                'face_image',
                openapi.IN_FORM,
                description="Image du visage pour la reconnaissance faciale",
                type=openapi.TYPE_FILE,
                required=True
            ),
            openapi.Parameter(
                'handicap_type',
                openapi.IN_FORM,
                description="Type de handicap",
                type=openapi.TYPE_STRING,
                enum=["AVEUGLE", "SOURD", "MUTILE_INF", "MUTILE_SUP", "MUET", "AUTRES"],
                default="AUTRES"
            ),
        ],
        consumes=['multipart/form-data'],
        tags=["User"],
        responses={
            201: openapi.Response(description="Utilisateur créé", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"email": openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            400: openapi.Response(description="Données invalides", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"erreur": openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        }
    )
    def post(self, request):
        try:
            is_valid, error_msg = self.validate_data(request.data, request.FILES)
            if not is_valid:
                return Response({'erreur': error_msg}, status=status.HTTP_400_BAD_REQUEST)
            
            if self.check_if_user_exist(request.data['email']):
                return Response({'erreur': 'email existant'}, status=status.HTTP_400_BAD_REQUEST)

            cin_data, cin_path, cin_error = self.process_cin_image(request.FILES['cin_image'])
            if cin_error:
                return Response({'erreur': f"CIN processing error: {cin_error}"}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
            saved_face_file, saved_face_path, face_error = self.process_face_image(request.FILES['face_image'])
            if face_error:
                return Response({'erreur': f"Face processing error: {face_error}"}, 
                            status=status.HTTP_400_BAD_REQUEST)
            cin_photo = face_recognition_save(image_path=cin_path, directory_to_save=os.path.join(settings.BASE_DIR, "media/faces"), filename_to_save=str(uuid4().hex))
            if os.path.exists(cin_path):
                os.remove(cin_path)
            match, distance = compare_faces(cin_photo, saved_face_path)
            if not match:
                return Response({'erreur': 'Faces do not match'}, status=status.HTTP_400_BAD_REQUEST)
            if os.path.exists(cin_photo):
                os.remove(cin_photo)
            user_data = {
                'name': cin_data.get('name', 'Unknown'),
                'email': request.data['email'],
                'password': uuid4().hex,
                'sexe': request.data.get('sexe', 'I')[0].upper() if request.data.get('sexe', 'I').lower() in ['masculin', 'feminin'] else 'I',
                'birth_date': cin_data.get('birth_date', '2000-01-01'),
                'cin_number': cin_data.get('cin_number', ''),
                'profile': saved_face_file,
                'handicap_type': request.data.get('handicap_type', 'AVEUGLE'),
                'is_staff': False,
                'is_active': False,
                'is_superuser': False,
                'user_type': 'HANDICAP',
            }
            serializer = RegisterSerializer(data=user_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"email": serializer.validated_data["email"]}, 
                            status=status.HTTP_201_CREATED)
            
            return Response({'erreur': 'Erreur de sérialisation'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(traceback.format_exc())
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginFaceView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    parser_classes = [MultiPartParser]
    
    def process_face_image(self, face_image, temp_directory="media/temp"):
        temp_path = None
        saved_face_path = None
        try:
            temp_path = os.path.join(temp_directory, f"temp_login_face_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
            if not os.path.exists(temp_directory):
                os.makedirs(temp_directory)
                
            with open(temp_path, 'wb') as f:
                f.write(face_image.read())
            
            saved_face_path = face_recognition_save(
                temp_path,
                temp_directory,
                f"login_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            )
            if not saved_face_path:
                return None, "Failed to detect and save face"
            
            return saved_face_path, None
        except Exception as e:
            return None, str(e)
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    def find_matching_user(self, face_image_path):
        try:
            users = User.objects.filter(user_type="HANDICAP")
            threshold = 0.5  # Seuil de similarité pour la reconnaissance faciale
            for user in users:
                if not user.profile or not os.path.exists(user.profile.path):
                    continue
                match, distance = compare_faces(user.profile.path, face_image_path, threshold)
                if match:
                    return user, distance
            return None, "Visage non reconnu"
        except Exception as e:
            return None, str(e)

    @swagger_auto_schema(
        operation_description="Connexion d'un utilisateur handicapé via reconnaissance faciale (multipart/form-data)",
        manual_parameters=[
            openapi.Parameter(
                'face_image',
                openapi.IN_FORM,
                description="Image du visage pour la reconnaissance faciale",
                type=openapi.TYPE_FILE,
                required=True
            ),
        ],
        consumes=['multipart/form-data'],
        tags=["User"],
        responses={
            200: openapi.Response(
                description="Connexion réussie",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "access": openapi.Schema(type=openapi.TYPE_STRING, example="eyJhbGciOiJIUzI1..."),
                        "name": openapi.Schema(type=openapi.TYPE_STRING, example="John Doe"),
                        "sexe": openapi.Schema(type=openapi.TYPE_STRING, example="M"),
                        "user_type": openapi.Schema(type=openapi.TYPE_STRING, example="HANDICAP"),
                        "email": openapi.Schema(type=openapi.TYPE_STRING, example="user@example.com"),
                    },
                ),
            ),
            400: openapi.Response(
                description="Erreur de validation ou visage non reconnu",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "erreur": openapi.Schema(type=openapi.TYPE_STRING, example="Visage non reconnu"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        saved_face_path = None
        try:
            if 'face_image' not in request.FILES:
                return Response({'erreur': 'face_image est requis'}, status=status.HTTP_400_BAD_REQUEST)

            face_image_path, face_error = self.process_face_image(request.FILES['face_image'])
            if face_error:
                return Response({'erreur': f"Face processing error: {face_error}"}, status=status.HTTP_400_BAD_REQUEST)
            saved_face_path = face_image_path

            user, error = self.find_matching_user(face_image_path)
            if not user:
                if saved_face_path and os.path.exists(saved_face_path):
                    os.remove(saved_face_path)
                return Response({'erreur': error}, status=status.HTTP_400_BAD_REQUEST)

            if saved_face_path and os.path.exists(saved_face_path):
                os.remove(saved_face_path)

            user.is_active = True
            update_last_login(None, user)
            user.save()

            refresh = RefreshToken.for_user(user)
            data = {
                'access': str(refresh.access_token),
                'name': user.name,
                'sexe': user.sexe,
                'user_type': user.user_type,
                'email': user.email,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            print(traceback.format_exc())
            if saved_face_path and os.path.exists(saved_face_path):
                os.remove(saved_face_path)
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        