from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from cryptography.fernet import Fernet
from django.conf import settings
import base64
import os

class SavedPassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class PasswordEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passwords')
    title = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    encrypted_password = models.TextField()
    website = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Generate encryption key if not exists
        if not hasattr(settings, 'ENCRYPTION_KEY'):
            key = Fernet.generate_key()
            settings.ENCRYPTION_KEY = key
        self.fernet = Fernet(settings.ENCRYPTION_KEY)

    def set_password(self, password):
        """Encrypt and store the password"""
        encrypted_data = self.fernet.encrypt(password.encode())
        self.encrypted_password = base64.b64encode(encrypted_data).decode()

    def get_password(self):
        """Decrypt and return the password"""
        encrypted_data = base64.b64decode(self.encrypted_password.encode())
        decrypted_data = self.fernet.decrypt(encrypted_data)
        return decrypted_data.decode()

    class Meta:
        verbose_name_plural = "Password Entries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.username}" 