"""
	authentication/permissions.py
	Nicholas S. Bradford
	08-14-17

"""

from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
	""" Basic permission checks returns true if the request has a user
			and it matches the current logged in account.
	"""

	def has_object_permission(self, request, view, account):
		""" TODO seems so simple that it must be in a library somewhere. """
		if request.user:
			return account == request.user
		return False
