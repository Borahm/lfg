from django.db import models


class Request(models.Model):
    text = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(
        "projects.Project",
        related_name="project_requests",
        related_query_name="project_requests",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owner_requests",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
