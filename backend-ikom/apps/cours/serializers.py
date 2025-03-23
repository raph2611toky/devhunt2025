from rest_framework import serializers
from .models import Course, Etape, Interrogation
import mimetypes
from django.conf import settings
from .models import Interrogation, Question, Reponse


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id",'titre', 'description', 'domaine',"status"]
        

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if not Etape.objects.filter(cours=instance).exists():
            raise serializers.ValidationError("Le cours doit avoir au moins une étape.")
        
        if not Interrogation.objects.filter(cours=instance).exists():
            raise serializers.ValidationError("Le cours doit avoir au moins une interrogation.")

        instance.status = "Published"
        instance.save()
        return instance

class EtapeSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    def get_document_url(self, obj):
        return f'{settings.BASE_URL}api/media/{obj.document}' if obj.document else None

    def get_video_url(self, obj):
        return f'{settings.BASE_URL}api/media/{obj.video}' if obj.video else None
    
    
    class Meta:
        model = Etape
        fields = ['id', 'cours', 'titre', "document",'document_url', "video", 'video_url', 'ordre', 'video_content']

    def validate_document(self, value):
        # Valider que le document est un fichier PDF si fourni
        if value:
            mime_type, _ = mimetypes.guess_type(value.name)
            if mime_type != 'application/pdf':
                raise serializers.ValidationError("Le fichier doit être un PDF.")
        return value

    def validate_video(self, value):
        # Valider que la vidéo est dans un format valide (ex : mp4)
        if value:
            mime_type, _ = mimetypes.guess_type(value.name)
            if not mime_type or not mime_type.startswith('video'):
                raise serializers.ValidationError("Le fichier doit être une vidéo valide.")
        return value

    def validate_cours(self, value):
        if value.status != 'Pend':
            raise serializers.ValidationError("Le cours doit être en statut 'Pending' pour ajouter des étapes.")
        return value  


class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = ['id', 'texte', 'est_correcte']


class QuestionSerializer(serializers.ModelSerializer):
    reponses = ReponseSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'texte', 'ordre', 'reponses']


class InterrogationSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Interrogation
        fields = ['id', 'etape', 'titre', 'created_at', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        interrogation = Interrogation.objects.create(**validated_data)
        
        for question_data in questions_data:
            reponses_data = question_data.pop('reponses')
            question = Question.objects.create(interrogation=interrogation, **question_data)
            
            for reponse_data in reponses_data:
                Reponse.objects.create(question=question, **reponse_data)
        
        return interrogation
