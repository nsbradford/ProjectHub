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

    url = '/api/v1/accounts/'
    data = {    'email': 'johndoe@gmail.com', 
                'username': 'johndoe', 
                'password': 'password123'
            }   

    def tearDown(self):
        """ After each test, remove all accounts in the test database."""
        # Account.objects.all().delete()
        pass


    def test_API_create_account(self):
        """ Test account creation and deletion. """
        self.assertEqual(Account.objects.count(), 0)
        
        post_response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, 'johndoe@gmail.com')
        self.assertEqual(new_account.username, 'johndoe')


    def test_API_delete_account_must_be_authenticated(self):
        """ """
        self.assertEqual(Account.objects.count(), 0)
        
        post_response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, 'johndoe@gmail.com')
        self.assertEqual(new_account.username, 'johndoe')

        delete_response = self.client.delete(self.url, {'id': new_account.id})
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 1)

    def test_API_delete_account(self):
        """ TODO must authenticated before deleting account """
        self.assertEqual(Account.objects.count(), 0)
        
        post_response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, 'johndoe@gmail.com')
        self.assertEqual(new_account.username, 'johndoe')

        self.client.login(email='johndoe@gmail.com', password='password123')

        # TODO

        # delete_response = self.client.delete(self.url, {'asdf': new_account.id})
        # self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
        # self.assertEqual(Account.objects.count(), 0)
        

    # def test_API_get_account(self):
    #     pass

    # def test_API_udpate_account(self):
    #     pass

    # def test_API_create_account_requires_password(self):
    #     """ POST without password results in error. """
    #     pass
