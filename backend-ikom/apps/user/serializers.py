from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.conf import settings

from apps.user.models import User

from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import PasswordField

from uuid import uuid4

class UserSerializer(serializers.ModelSerializer):
    profile_url = serializers.SerializerMethodField()
    birth_date = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'birth_date', 'profile_url', 'sexe', 'is_active', 'cin_number', 'handicap_type', 'user_type']
        
    def get_profile_url(self, obj):
        return f'{settings.BASE_URL}api/media/{obj.profile}' if obj.profile else None
    
    def get_birth_date(self, obj):
        return obj.birth_date.strftime('%d-%m-%Y')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = PasswordField()
    
    def validate(self, attrs):
        user = authenticate(**attrs)
        if not user:
            raise AuthenticationFailed("Identifiants invalides")
        if user.user_type != "MODERATOR":
            raise AuthenticationFailed("Cette méthode de connexion est réservée aux modérateurs/professeurs")
        
        user.is_active = True
        update_last_login(None, user)
        user.save()
        
        data = {}
        refresh = self.get_token(user)
        data['access'] = str(refresh.access_token)
        data['name'] = user.name
        data['sexe'] = user.sexe
        data['user_type'] = user.user_type
        return data
    
    def get_token(self, user):
        token = RefreshToken.for_user(user)
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'sexe', 'cin_number', 'birth_date', 'is_staff', 'handicap_type', 'user_type', 'profile']

    def validate(self, attrs):
        if attrs.get('user_type') == "HANDICAP" and not attrs.get('profile'):
            raise serializers.ValidationError("Le champ profile est requis pour les utilisateurs handicapés")
        if attrs.get('user_type') == "MODERATOR" and attrs.get('handicap_type') != "AUCUN":
            raise serializers.ValidationError("Les modérateurs/professeurs ne peuvent pas avoir un handicap_type autre que AUCUN")
        return attrs
    
    def create(self, validated_data):
        is_staff = validated_data.get("is_staff", False)
        cin_number = validated_data.get("cin_number", str(uuid4()))
        user = User.objects.create(
            name=validated_data['name'].capitalize(),
            email=validated_data['email'],
            sexe=validated_data.get('sexe', 'I')[0].upper(),
            birth_date=validated_data['birth_date'],
            cin_number=cin_number,
            profile=validated_data.get('profile'),
            is_staff=is_staff,
            is_superuser=False,
            handicap_type=validated_data.get('handicap_type', 'AUCUN'),
            user_type=validated_data.get('user_type', 'HANDICAP'),
        )
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        user_created = User.objects.get(id=user.id)
        data = {
            'email': user_created.email
        }
        return data