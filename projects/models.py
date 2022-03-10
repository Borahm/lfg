from django.db import models


class Project(models.Model):
    PROJECT_STATUS = [
        ('', 'Select'),
        ('IDEATING', 'Ideating'),
        ('EXPLORING', 'Exploring'),
        ('BUILDING', 'Building'),
    ]
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owned_projects",
        on_delete=models.CASCADE,
        default=None
    )
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(default=None, max_length=100)
    tldr = models.CharField(default=None, max_length=140)
    description = models.TextField(default=None, max_length=1000)
    status = models.CharField(
        default=None, max_length=100, choices=PROJECT_STATUS)
    project_image = models.CharField(default=None, max_length=500)

    def __str__(self):
        return f"{self.title}"
