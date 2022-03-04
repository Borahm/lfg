from django.contrib import admin
from django.contrib.auth import get_user_model

# this method returns the active user model - Django tells us to use this whenever we are using the User model
User = get_user_model()

# Register your models here.
admin.site.register(User)  # Register active User model
