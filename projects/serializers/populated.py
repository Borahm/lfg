from .common import ProjectSerializer
from members.serializers.common import MemberSerializer
from members.serializers.populated import PopulatedMemberSerializer
from posts.serializers.populated import PopulatedPostSerializer
from join_requests.serializers.populated import PopulatedRequestSerializer

from jwt_auth.serializers.common import UserSerializer


class PopulatedProjectSerializer(ProjectSerializer):
    owner = UserSerializer()
    members = PopulatedMemberSerializer(many=True)
    requests = PopulatedRequestSerializer(many=True)
    posts = PopulatedPostSerializer(many=True)
