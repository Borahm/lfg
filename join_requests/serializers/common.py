# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
from jwt_auth.serializers.common import UserSerializer
# import Project model its now up a level so we write ..models.models
from ..models import Request


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
