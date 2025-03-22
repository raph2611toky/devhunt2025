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
        serializer = CourseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            course = serializer.save()
            return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EtapeCreateAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EtapeSerializer
    parser_classes = [MultiPartParser, FormParser]  # Permettre l'upload de fichiers

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
            # Récupération des données de la requête
            etape_data = request.data

            # Validation des données via le serializer
            serializer = self.serializer_class(data=etape_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()                
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
        cours_id = kwargs.get('cours_id')  # Récupère l'ID du cours dans les paramètres URL
        try:
            etapes = Etape.objects.filter(cours=cours_id)
            if not etapes:
                return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)

            # Sérialiser les étapes et les retourner dans la réponse
            serializer = self.serializer_class(etapes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Etape.DoesNotExist:
            return Response({'erreur': 'Cours non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
      
class InterrogationCreateAPIView(APIView):
    permission_classes = [AllowAny]
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
            required=['id']  # ID est obligatoire
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



