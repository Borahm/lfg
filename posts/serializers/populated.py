from .common import PostSerializer  # common review serializer will be extended
# user serializer will be used to populate the owner field
from jwt_auth.serializers.common import UserSerializer


class PopulatedPostSerializer(PostSerializer):
    owner = UserSerializer()
