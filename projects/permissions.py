from rest_framework import permissions


class IsAuthorOfProject(permissions.BasePermission):
    def has_object_permission(self, request, view, project):
        if request.user:
            return project.author == request.user
        return False

