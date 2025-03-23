from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from apps.cours.models import Course, Etape, Interrogation
from apps.cours.serializers import CourseSerializer, EtapeSerializer, InterrogationSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from helpers.video import video_to_subtitled_video
from helpers.voice import text_to_speech
from helpers.image_recognition import pdf_to_text
from django.conf import settings
from django.conf import settings
from django.core.files import File
import os, traceback

class CourseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=CourseSerializer,
        tags=["Cours"],
        responses={
            201: CourseSerializer(),
            400: "Bad Request",
        },
        operation_description="Ajouter un nouveau cours",
        operation_summary="Ajout d'un cours",
    )
    def post(self, request):
        try:
            print(request.data)
            data_request = request.data
            data_request["status"]  = "Pend"
            serializer = CourseSerializer(data=data_request, context={'request': request})
            if serializer.is_valid():
                course = serializer.save()
                return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(traceback)
            return Response({"erreur":str(e)}, status=400)

class EtapeCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EtapeSerializer
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_description="Création d'une étape de cours avec upload de fichiers (PDF et vidéo)",
        manual_parameters=[
            openapi.Parameter(
                'cours', openapi.IN_FORM, description="ID du cours", type=openapi.TYPE_INTEGER, required=True
            ),
            openapi.Parameter(
                'titre', openapi.IN_FORM, description="Titre de l'étape", type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'document', openapi.IN_FORM, description="Fichier PDF à télécharger", type=openapi.TYPE_FILE, required=False
            ),
            openapi.Parameter(
                'video', openapi.IN_FORM, description="Fichier vidéo à télécharger", type=openapi.TYPE_FILE, required=False
            ),
            openapi.Parameter(
                'ordre', openapi.IN_FORM, description="Ordre de l'étape", type=openapi.TYPE_INTEGER, required=True
            ),
        ],
        tags=["Etapes"],
        responses={
            201: openapi.Response(
                description="Étape de cours créée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'cours': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'titre': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Données incorrectes"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        try:
            etape_data = request.data
            cours = Course.objects.get(id=etape_data["cours"])
            etape_data["ordre"] = cours.etapes.all().count() + 1
            serializer = self.serializer_class(data=etape_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()                
                etape_new = serializer.save()
                video_path = os.path.join(settings.BASE_DIR, etape_new.video.path)
                video_path_output = os.path.join(settings.BASE_DIR, "/media/courses/videos/"+etape_new.video.name)
                print(video_path_output)

                output_video_path, video_content = video_to_subtitled_video(video_path, output_video_path=video_path_output)

                if output_video_path and os.path.exists(output_video_path):
                    with open(output_video_path, 'rb') as video_file:
                        etape_new.video.save(os.path.basename(video_path), File(video_file), save=False)

                    etape_new.video_content = video_content if video_content else ""
                    etape_new.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'erreur': 'Erreur de validation'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EtapeListAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EtapeSerializer

    @swagger_auto_schema(
        operation_description="Récupérer toutes les étapes d'un cours",
        responses={
            200: EtapeSerializer(many=True),
            404: openapi.Response(
                description="Cours non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Cours non trouvé"),
                    },
                ),
            ),
        },
        tags=["Etapes"],
    )
    def get(self, request, *args, **kwargs):
        cours_id = kwargs.get('cours_id')
        try:
            etapes = Etape.objects.filter(cours=cours_id)
            if not etapes:
                return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.serializer_class(etapes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Etape.DoesNotExist:
            return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class EtapeDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer une étape spécifique d'un cours",
        manual_parameters=[
            openapi.Parameter(
                'id', openapi.IN_PATH, description="ID de l'étape à supprimer", type=openapi.TYPE_INTEGER, required=True
            ),
        ],
        responses={
            204: openapi.Response(description="Étape supprimée avec succès"),
            404: openapi.Response(
                description="Étape non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Étape non trouvée"),
                    },
                ),
            ),
            400: openapi.Response(
                description="Erreur lors de la suppression",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Erreur lors de la suppression"),
                    },
                ),
            ),
        },
        tags=["Etapes"],
    )
    def delete(self, request, id):
        try:
            etape = Etape.objects.get(id=id)
            if etape.document and os.path.exists(etape.document.path):
                os.remove(etape.document.path)
            if etape.video and os.path.exists(etape.video.path):
                os.remove(etape.video.path)
            etape.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Etape.DoesNotExist:
            return Response({'erreur': 'Étape non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'erreur': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class InterrogationCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterrogationSerializer

    @swagger_auto_schema(
        operation_description="Créer une interrogation avec des questions et des réponses associées à une étapes.",
        request_body=InterrogationSerializer,
        responses={
            201: openapi.Response(
                description="Interrogation créée avec succès",
                schema=InterrogationSerializer,
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Données incorrectes"),
                    },
                ),
            ),
        },
        tags=["Interrogations"],
    )
    def post(self, request, *args, **kwargs):
        etape_id = request.data.get('etape')
        
        # Vérifier si le etape existe
        try:
            etape_id = Etape.objects.get(id=etape_id)
        except Etape.DoesNotExist:
            return Response({'erreur': 'etape non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        # Ajout de l'interrogation
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'erreur': 'Erreur de validation des données'}, status=status.HTTP_400_BAD_REQUEST)

class InterrogationListAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = InterrogationSerializer

    @swagger_auto_schema(
        operation_description="Récupérer toutes les intérogations (test) d'un cours",
        responses={
            200: InterrogationSerializer(many=True),
            404: openapi.Response(
                description="Interrogation non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Cours non trouvé"),
                    },
                ),
            ),
        },
        tags=["Interrogations"],
    )
    def get(self, request, *args, **kwargs):
        etape_id = kwargs.get('etape_id')  # Récupère l'ID du cours dans les paramètres URL
        try:
            interrogations = Interrogation.objects.filter(etape=etape_id)
            if not interrogations:
                return Response({'erreur': 'Etape non trouvé'}, status=status.HTTP_404_NOT_FOUND)

            # Sérialiser les intérrogations et les retourner dans la réponse
            serializer = self.serializer_class(interrogations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Interrogation.DoesNotExist:
            return Response({'erreur': 'Interrogation non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class CoursePublishAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Publier un cours (doit avoir au moins une étape et une interrogation).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'id': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID du cours à publier", example=1),
            },
            required=['id']
        ),
        responses={
            200: openapi.Response(
                description="Cours publié avec succès",
                schema=CourseSerializer,
            ),
            400: openapi.Response(
                description="Données invalides ou conditions non remplies",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Le cours doit avoir au moins une étape et une interrogation."),
                    },
                ),
            ),
        },
        tags=["Cours"],
    )
    def post(self, request, *args, **kwargs):
        try:
            # Récupérer l'ID du cours depuis la requête
            cours_id = request.data.get('id')
            
            if not cours_id:
                return Response({"erreur": "L'ID du cours est requis."}, status=status.HTTP_400_BAD_REQUEST)

            # Récupérer le cours à partir de l'ID
            cours = Course.objects.get(id=cours_id)

            # Vérifier que le cours a au moins une étape et une interrogation
            if not cours.etapes.exists():
                return Response({"erreur": "Le cours doit avoir au moins une étape et une interrogation."}, status=status.HTTP_400_BAD_REQUEST)

            for etape in cours.etapes.all():
                if not etape.interrogations.exists():
                    return Response({"erreur": "L'étape doit avoir au moins une interrogation."}, status=status.HTTP_400_BAD_REQUEST)
            

            # Publier le cours
            cours.status = "Published"  # Marquer le cours comme publié (ou toute autre logique)
            cours.save()

            # Sérialiser et renvoyer les données
            serializer = CourseSerializer(cours)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Course.DoesNotExist:
            return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'erreur': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CourseListAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Récupérer la liste de tous les cours",
        responses={
            200: CourseSerializer(many=True),
            404: openapi.Response(
                description="Aucun cours trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Aucun cours trouvé"),
                    },
                ),
            ),
        },
        tags=["Cours"],
    )
    def get(self, request):
        try:
            courses = Course.objects.all()
            if not courses.exists():
                return Response({'erreur': 'Aucun cours trouvé'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'erreur': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CourseDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Récupérer les détails complets d'un cours (avec étapes et interrogations)",
        manual_parameters=[
            openapi.Parameter(
                'id_cours', openapi.IN_PATH, description="ID du cours", type=openapi.TYPE_INTEGER, required=True
            ),
        ],
        responses={
            200: CourseSerializer(),
            404: openapi.Response(
                description="Cours non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Cours non trouvé"),
                    },
                ),
            ),
        },
        tags=["Cours"],
    )
    def get(self, request, id_cours):
        try:
            course = Course.objects.get(id=id_cours)
            serializer = CourseSerializer(course, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'erreur': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FromVideoAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EtapeSerializer
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_description="Traduction d'un fichier video en transcrivable",
        manual_parameters=[
            openapi.Parameter(
                'video', openapi.IN_FORM, description="Fichier vidéo à téleverser", type=openapi.TYPE_FILE, required=False
            ),
        ],
        tags=["Traduction"],
        responses={
            201: openapi.Response(
                description="Fichier video transcrit",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'video_url': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'video_content':openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Données incorrectes"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        try:
            video_path = os.path.join(settings.BASE_DIR, request.FILES['video'])
            video_path_output = os.path.join(settings.BASE_DIR, "/media/traductions/videos/"+video_path)
            print(video_path_output)

            output_video_path, video_content = video_to_subtitled_video(video_path, output_video_path=video_path_output)
            video_url = os.path.join(settings.BASE_URL, output_video_path)
            return Response({"video_url":video_url, "video_content":video_content}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FromPdfAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EtapeSerializer
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_description="Traduction d'un fichier pdf en audio",
        manual_parameters=[
            openapi.Parameter(
                'pdf', openapi.IN_FORM, description="Fichier vidéo à téleverser", type=openapi.TYPE_FILE, required=False
            ),
        ],
        tags=["Traduction"],
        responses={
            201: openapi.Response(
                description="Fichier video transcrit",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'audio_url': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'text_content':openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'erreur': openapi.Schema(type=openapi.TYPE_STRING, example="Données incorrectes"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        try:
            pdf_path = os.path.join(settings.BASE_DIR, request.FILES['pdf'])
            pdf_path_output = os.path.join(settings.BASE_DIR, "/media/traductions/videos/"+pdf_path)
            print(pdf_path_output)

            pdf_content = pdf_to_text(pdf_path_output)
            pdf_audio = text_to_speech(pdf_content)
            audio_url = os.path.join(settings.BASE_URL, pdf_audio)
            return Response({"audio_url":audio_url, "text_content":pdf_content}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"erreur": str(e)}, status=status.HTTP_400_BAD_REQUEST)

