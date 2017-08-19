"""
	tests/projects/tests.py
	Nicholas S. Bradford
	08-17-17

"""

# from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from projects.models import Project
from projects import views


class ProjectTests(APITestCase):

    url = '/api/v1/projects/'
    data = {'author': 'myauthor', 'content': 'mycontent'}

    def test_create_project_must_be_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project(self):
        """ Ensure we can create a new project object. """
        # TODO must authenticate the user before posting?
        # response = self.client.post(self.url, self.data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(Account.objects.count(), 1)
        # self.assertEqual(Account.objects.get().author, 'myauthor')
        # self.assertEqual(Account.objects.get().content, 'mycontent')
        pass