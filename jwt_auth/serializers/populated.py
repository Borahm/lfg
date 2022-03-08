# common review serializer will be extended
from .common import UserSerializer
# user serializer will be used to populate the owner field
from jwt_auth.serializers.common import UserSerializer


class PopulatedUserSerializer(UserSerializer):
    owner = UserSerializer()
