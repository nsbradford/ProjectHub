"""
    authentication/views.py
    Nicholas S. Bradford
    08-14-17

"""

import json

from django.contrib.auth import authenticate, login, logout
from rest_framework import status, views, permissions, viewsets
from rest_framework.response import Response

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    """ Combined RESTful view for Account model. """

    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        """ We allow anyone to use requests in SAFE_METHODS (GET, HEAD, OPTIONS),
                and anyone to POST to create a new user. Otherwise, require
                authentication and to be owner of the Account.
            TODO: we might want only authenticated users to be able to view
                Account info for other users.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        if self.request.method == 'POST':
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        """ Checks if data is valid, and creates a new Account.
            We override this because the default create() would store
                passwords in plaintext, which we get around with
                Account.objects.create_user().
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'Account creation request was invalid.'
        }, status=status.HTTP_400_BAD_REQUEST)



class LoginView(views.APIView):
    """ View for logins. APIView is specifically for AJAX requests. """

    def post(self, request, format=None):
        """ Log in by POST. The Django authenticate() performs email/pass
                lookup and will return None if no matching user is found.
            Return HTTP_401_UNAUTHORIZED if failed,
                serialized Account if successful.
        """
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)
                serialized = AccountSerializer(account)
                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    """ View for logouts. APIView is specifically for AJAX requests.
        Only authenticated users should be able to logout.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response({}, status=status.HTTP_204_NO_CONTENT)
