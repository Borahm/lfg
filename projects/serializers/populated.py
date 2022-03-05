from .common import ProjectSerializer
from jwt_auth.serializers.common import UserSerializer
from posts.serializers.populated import PopulatedPostSerializer


class PopulatedProjectSerializer(ProjectSerializer):
    owner = UserSerializer()
    # members = UserSerializer(many=True)
    # posts = PopulatedPostSerializer(many=True)
