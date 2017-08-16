"""
	authentication/views.py
	Nicholas S. Bradford
	08-14-17

"""

import json

from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework import permissions, viewsets

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
				and anyone to POST to create a new user.
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

	def post(self, request, format=None):
		data = json.loads(request.body)
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
	permission_classes = (permissions.IsAuthenticated,)

	def post(self, request, format=None):
		logout(request)

		return Response({}, status=status.HTTP_204_NO_CONTENT)
