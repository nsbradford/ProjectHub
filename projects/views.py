"""
    projects/views.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.shortcuts import get_object_or_404

from projects.permissions import IsAuthorOfProject, IsEmailActivated
from projects.models import Project, Major, Tag
from projects.serializers import ProjectSerializer, MajorSerializer, TagSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """ Combined RESTful view for Project model. """

    LAZYLOAD_TRANSACTION_LENGTH = 10

    serializer_class = ProjectSerializer
    lookup_field = 'pk'


    def get_permissions(self):
        """ We allow anyone to use requests in SAFE_METHODS (GET, HEAD, OPTIONS).
                Otherwise, require authentication and authorization.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfProject(), IsEmailActivated(),)


    def perform_create(self, serializer):
        """ Automatically add the current Account as the author
                of the project.
        """
        # TODO ideally this would be handled with built-in permissions classes
        if not self.request.user.is_confirmed:
            raise PermissionDenied(detail='Only users with confirmed emails may create projects.')

        serializer.save(author=self.request.user)
        return super(ProjectViewSet, self).perform_create(serializer)

    def get_queryset(self):
        searchString = self.request.query_params.get("searchString", None)
        if searchString:
            return Project.objects.filter(
                title__icontains=searchString).order_by('-created_at')
        return Project.objects.all().order_by('-created_at')


    def list(self, request, pk=None):
        last_project_index = int(
                request.query_params.get("lastProjectIndex", 0))
        queryset = self.get_queryset()
        num_project = queryset.count()

        #   Case 1, we have used returned all of the projects
        #   In this case, return nothing and a status notifying the user
        #   That there is nothing more to return
        if last_project_index >= num_project:
            serializer = self.get_serializer(None, many=True)
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

        #   If we are asked to return more projects than we have, but we
        #   Have not reported all of the projects yet, then go ahead and
        #   Return the projects but also notify the user that that's all folks
        if last_project_index + self.LAZYLOAD_TRANSACTION_LENGTH > num_project:
            rest_of_projects = num_project % self.LAZYLOAD_TRANSACTION_LENGTH
            serializer = self.get_serializer(queryset[
                            last_project_index:last_project_index +
                            rest_of_projects], many=True)

            return Response(serializer.data,
                            status=status.HTTP_206_PARTIAL_CONTENT)

        #   Otherwise, the normal use case -- send back N amount of projects. (Return HTTP_200)
        else:
            serializer = self.get_serializer(queryset[
                        last_project_index:last_project_index + self.LAZYLOAD_TRANSACTION_LENGTH],
                        many=True)

            return Response(serializer.data)



class AccountProjectsViewSet(viewsets.ViewSet):
    queryset = Project.objects.select_related('author').all()
    serializer_class = ProjectSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)



class MajorViewSet(viewsets.ViewSet):
    queryset = Major.objects.all()
    serializer_class = MajorSerializer

    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)



class TagViewSet(viewsets.ViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

