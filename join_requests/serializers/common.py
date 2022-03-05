# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
# import review model its now up a level so we write ..models.models
from ..models import Request


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
