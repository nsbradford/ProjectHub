"""
    projects/permissions.py
    Nicholas S. Bradford
    08-17-17

"""

from rest_framework import permissions


class IsAuthorOfProject(permissions.BasePermission):
    """ Basic permission checks returns true if the request has an Account
            and it matches the Account for the project.
    """
    def has_object_permission(self, request, view, project):
        if request.user:
            return project.author == request.user
        return False


class IsEmailActivated(permissions.BasePermission):
    """ Basic permission checks returns true if the request has an Account
            and it has its email confirmed.
    """
    def has_object_permission(self, request, view, project):
        if request.user:
            return request.user.is_confirmed
        return False