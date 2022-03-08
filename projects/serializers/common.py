# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
# import Project model its now up a level so we write ..models.models
from ..models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
