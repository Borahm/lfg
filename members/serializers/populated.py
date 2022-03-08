from .common import MemberSerializer
from projects.serializers.common import ProjectSerializer
from jwt_auth.serializers.common import UserSerializer


class PopulatedMemberSerializer(MemberSerializer):
    owner = UserSerializer()
    project = ProjectSerializer()
