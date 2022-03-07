from .common import ProjectSerializer, PostSerializer
from jwt_auth.serializers.common import UserSerializer
from jwt_auth.serializers.populated import PopulatedUserSerializer
from join_requests.serializers.populated import PopulatedRequestSerializer


class PopulatedProjectSerializer(ProjectSerializer):
    owner = UserSerializer()
    members = UserSerializer(many=True)
    written_posts = PostSerializer(many=True)
    written_posts.owner = UserSerializer()
    project_requests = PopulatedRequestSerializer(many=True)


class PopulatedPostSerializer(PostSerializer):
    owner = UserSerializer()
