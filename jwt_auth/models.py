from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):  # Extending the default Django User Model
    email = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    course_location = models.CharField(max_length=20)
    course_number = models.IntegerField(default=None)
    profile_picture = models.CharField(max_length=300)
    # Foreign key projects
