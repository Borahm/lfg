from django.db import models


class Member(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(
        'projects.Project',
        related_name="project_members",
        related_query_name="project_members",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="owner_members",
        on_delete=models.CASCADE,
        default=None,
        blank=True,
    )
