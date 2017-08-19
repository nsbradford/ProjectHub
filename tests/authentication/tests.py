"""
    tests/authentication/tests.py
    Nicholas S. Bradford
    08-18-17

"""

# from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import Account


class AccountTests(APITestCase):

    def test_API_create_account(self):
        """ Test account creation. """
        url = '/api/v1/accounts/'
        data = {    'email': 'johndoe@gmail.com', 
                    'username': 'johndoe', 
                    'password': 'password123'
                }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().email, 'johndoe@gmail.com')
        self.assertEqual(Account.objects.get().username, 'johndoe')

    def test_API_create_account_requires_password(self):
        """ POST without password results in error. """
        pass