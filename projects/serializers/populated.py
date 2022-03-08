from .common import ProjectSerializer
from members.serializers.common import MemberSerializer
from posts.serializers.common import PostSerializer
from join_requests.serializers.common import RequestSerializer

from jwt_auth.serializers.common import UserSerializer


class PopulatedProjectSerializer(ProjectSerializer):
    owner = UserSerializer()
    project_members = MemberSerializer(many=True)
    project_posts = PostSerializer(many=True)
    project_posts.owner = UserSerializer()
    project_requests = RequestSerializer(many=True)
