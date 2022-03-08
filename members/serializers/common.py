# import serializers so we can extend rom ModelSerialer
from rest_framework import serializers
from jwt_auth.serializers.common import UserSerializer
# import Project model its now up a level so we write ..models.models
from ..models import Member


class MemberSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = Member
        fields = '__all__'


class SendMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
