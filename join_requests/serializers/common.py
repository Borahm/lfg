# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
# import review model its now up a level so we write ..models.models
from ..models import Request
from jwt_auth.serializers.common import UserSerializer


class RequestSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = Request
        fields = '__all__'


class SendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
