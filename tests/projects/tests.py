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
    author = 'myauthor'
    title = 'mytitle'
    description = 'mydescription'
    major = 'CS'
    tagline = 'This is the tagline for John Doe #1'
    setup_data = {  
                'email': email, 
                'username': username, 
                'password': password,
                'tagline': tagline
            }
    project_data = {
        'title': title,
        'description': description,
        'major': major
    }
    accounts_url = '/api/v1/accounts/'
    project_url = '/api/v1/projects/'


    def setup_account(self):
        """ Create an account and confirm it is stored properly.
            Returns:
                The created Account.
        """
        self.assertEqual(Account.objects.count(), 0)
        post_response = self.client.post(self.accounts_url, self.setup_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_account = Account.objects.get()
        self.assertEqual(new_account.email, self.email)
        self.assertEqual(new_account.username, self.username)
        return new_account


    def setup_account_and_project(self):
        self.assertEqual(Account.objects.count(), 0)
        new_account = self.setup_account()
        self.client.login(email=self.email, password=self.password)
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        new_project = Project.objects.get()
        self.assertEqual(new_project.author, new_account)
        self.assertEqual(new_project.title, self.title)
        self.assertEqual(new_project.description, self.description)
        self.assertEqual(new_project.major, self.major)
        return new_account


    def test_create_project_must_be_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project(self):
        """ Ensure we can create a new project object. """
        self.setup_account_and_project()


    # def test_delete_project(self):
    #     new_account = self.setup_account_and_project()
    #     project_id = str(new_account.pk) # '1'
    #     response = self.client.post(self.project_url + project_id)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK) # TODO throwing 405 error
        

    # def test_update_project(self):
    #     """ TODO allow projects to be edited. """
    #     pass

    # def test_get_single_project(self):
    #     """ TODO GET a single project by author and project name. """
    #     pass