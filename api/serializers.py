from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SavedPassword, PasswordEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SavedPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedPassword
        fields = ('id', 'title', 'password', 'created_at', 'updated_at')
        read_only_fields = ('user',)

class PasswordEntrySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = PasswordEntry
        fields = ['id', 'title', 'username', 'password', 'website', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = PasswordEntry(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data) 