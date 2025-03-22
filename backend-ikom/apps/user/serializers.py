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
        fields = ['id', 'name', 'email','birth_date', 'profile_url', 'sexe','is_active', 'cin_number', 'handicap_type']
        
    def get_profile_url(self, obj):
        return f'{settings.BASE_URL}api/media/{obj.profile}' if obj.profile else None
    
    def get_birth_date(self,obj):
        return obj.birth_date.strftime('%d-%m-%Y')
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = PasswordField()
    
    def validate(self, attrs):
        users = authenticate(**attrs)
        if not users:
            raise AuthenticationFailed()
        users_logged = User.objects.get(id=users.id)
        users_logged.is_active = True
        update_last_login(None, users_logged)
        users_logged.save()
        data = {}
        refresh = self.get_token(users_logged)
        data['access'] = str(refresh.access_token)
        data['name'] = users_logged.name
        data['sexe'] = users_logged.sexe
        return data
    
    def get_token(self, users):
        token = RefreshToken.for_user(users)
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'sexe', 'cin_number', 'birth_date', 'is_staff', 'handicap_type']

    def validate(self, attrs):
        self.create(attrs)
        return attrs
    
    def create(self, validated_data):
        is_staff=validated_data.get("is_staff", False)
        cin_number = validated_data.get("cin_number", str(uuid4()))
        users = User.objects.create(
            name=validated_data['name'].capitalize(),
            email=validated_data['email'],
            sexe=validated_data.get('sexe','I')[0].upper(),
            birth_date=validated_data['birth_date'],
            cin_number=cin_number,
            is_staff=is_staff,
            is_superuser=False,
        )
        users.set_password(validated_data['password'])
        users.is_active = False
        users.save()
        user_created = User.objects.get(id=users.id)
        data = {
            'email': user_created.email
        }
        return data