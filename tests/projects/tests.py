"""
	tests/projects/tests.py
	Nicholas S. Bradford
	08-17-17

"""

# from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import Account
from projects.models import Project
from projects import views


class ProjectTests(APITestCase):

    email = 'johndoe@gmail.com'
    username = 'johndoe'
    password = 'password123'
    data = {'author': 'myauthor', 'content': 'mycontent'}
    url = '/api/v1/projects/'


    def test_create_project_must_be_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    # def setup_account(self):
    #     """ Setup an account to use for posting projects. """
    #     account = Account(email=self.email, username=self.username, password=self.password)
    #     self.assertEqual(Account.objects.count(), 1)
    #     print '[' + account.password + ']'


    # def setup_project(self):
    #     self.assertEqual(Account.objects.count(), 0)
    #     self.client.login(email=self.email, password=self.password)
    #     response = self.client.post(self.url, self.data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Account.objects.count(), 1)
    #     self.assertEqual(Account.objects.get().author, 'myauthor')
    #     self.assertEqual(Account.objects.get().content, 'mycontent')


    # def test_create_project(self):
    #     """ Ensure we can create a new project object. """
    #     self.setup_account()


    # def test_get_single_project(self):
    #     """ TODO GET a single project by author and project name. """
    #     pass