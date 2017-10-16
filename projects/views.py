"""
    projects/views.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import permissions, viewsets
from rest_framework.response import Response

from projects.models import Project
from projects.permissions import IsAuthorOfProject
from projects.serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """ Combined RESTful view for Project model. """

    queryset = Project.objects.order_by('-created_at')
    serializer_class = ProjectSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        """ We allow anyone to use requests in SAFE_METHODS (GET, HEAD, OPTIONS).
                Otherwise, require authentication and authorization.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfProject(),)

    def perform_create(self, serializer):
        """ Automatically add the current Account as the author
                of the project.
        """
        instance = serializer.save(author=self.request.user)
        return super(ProjectViewSet, self).perform_create(serializer)



class AccountProjectsViewSet(viewsets.ViewSet):
    queryset = Project.objects.select_related('author').all()
    serializer_class = ProjectSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
