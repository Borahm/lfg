from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):  # Extending the default Django User Model
    email = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    # profile_image = models.CharField(max_length=300)
    course_location = models.CharField(max_length=20)
    course_number = models.IntegerField()
    projects = models.ManyToManyField(
        "projects.Project",
        related_name="user_projects",
        default=None,
        blank=True,
    )
    requests = models.ManyToManyField(
        "join_requests.Request",
        related_name="user_requests",
        default=None,
        blank=True,
    )
    # Foreign key projects
