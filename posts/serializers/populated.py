from projects.serializers.common import ProjectSerializer
from jwt_auth.serializers.common import UserSerializer
from .common import PostSerializer


class PopulatedPostSerializer(PostSerializer):
    owner = UserSerializer()
