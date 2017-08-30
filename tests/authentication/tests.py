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


# class AccountModelTests(TestCase):
#     """ Tests for the Account model. """

#     def test_attributes(self):
#         pass


class APIAccountTests(APITestCase):
    """ RESTful API tests for Account. """

    email = 'johndoe@gmail.com'
    username = 'johndoe'
    tagline = 'This is the tagline for John Doe #1'
    tagline_update = 'This is the tagline for John Doe #2'
    password = 'password123'
    setup_data = {  
                    'email': email, 
                    'username': username, 
                    'password': password,
                    'tagline': tagline
                }
    update_data = {  
                    'email': email, 
                    'username': username,
                    'tagline': tagline_update,
                    'password': '1',
                    'confirm_password': '1'
                }
    update_data_bad_pass = {  
                    'email': email, 
                    'username': username,
                    'tagline': tagline_update,
                    'password': '1',
                    'confirm_password': '2'
                }
    incomplete_data = {  
                    'email': email, 
                    'username': username
                }
    url = '/api/v1/accounts/'
    url_username = url + username + '/'


    # Helpers

    def setup_account(self):
        """ Create an account and confirm it is stored properly.
            Returns:
                The created Account.
        """
        self.assertEqual(Account.objects.count(), 0)
        post_response = self.client.post(self.url, self.setup_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, self.email)
        self.assertEqual(new_account.username, self.username)
        return new_account

    # Tests

    def test_API_create_account(self):
        """ Test account creation and deletion. """
        self.setup_account()


    def test_API_create_account_requires_password(self):
        """ POST without password results in error. """
        self.assertEqual(Account.objects.count(), 0)
        post_response = self.client.post(self.url, self.incomplete_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Account.objects.count(), 0)


    def test_API_get_account_no_password(self):
        """ Any unauthenticated user can GET any account, but it should not contain
                password information.
        """
        self.setup_account()
        get_response = self.client.get(self.url_username)
        self.assertEqual(len(get_response.data), 8)
        self.assertEqual(get_response.data['email'], self.email)
        self.assertEqual(get_response.data['username'], self.username)
        self.assertIn('created_at', get_response.data)
        self.assertIn('updated_at', get_response.data)
        self.assertIn('first_name', get_response.data)
        self.assertIn('last_name', get_response.data)
        self.assertIn('tagline', get_response.data)
        self.assertNotIn('password', get_response.data)


    def test_API_udpate_account_must_login(self):
        """ PUT to update without. """
        self.setup_account()
        update_response = self.client.put(self.url_username, self.update_data)
        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 1)


    def test_API_udpate_account(self):
        """ TODO: Only an authenticated user can update their account. 
            Use update_response.content to see response.
        """
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        update_response = self.client.put(self.url_username, self.update_data)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.count(), 1)
        updated_account = Account.objects.get()
        self.assertEqual(updated_account.tagline, self.tagline_update)


    def test_API_udpate_account_passwords_match(self):
        """ TODO: Passwords must match when updating an account. 
                Look in serializer update.
        """
        # self.setup_account()
        # self.client.login(email=self.email, password=self.password)
        # update_response = self.client.put(self.url_username, self.update_data_bad_pass)
        # self.assertEqual(update_response.status_code, status.HTTP_400_BAD_REQUEST)
        # self.assertEqual(Account.objects.count(), 1)
        pass


    def test_API_delete_account_must_login(self):
        """ Only an authenticated user can delete their own account. """
        new_account = self.setup_account()
        delete_response = self.client.delete(self.url_username)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 1)


    def test_API_delete_account(self):
        """ Deleting account removes entry from database. """
        self.setup_account()
        self.client.login(email=self.email, password=self.password)
        delete_response = self.client.delete(self.url_username)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Account.objects.count(), 0)
