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
    new_title = title + '-edited!'
    new_description = description + '-edited!'
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
    project_data_edited = {
        'title': new_title,
        'description': new_description,
        'major': major
    }
    accounts_url = '/api/v1/accounts/'
    project_url = '/api/v1/projects/'


    @staticmethod
    def make_project_url(account):
        return ProjectTests.project_url + str(account.pk) + '/'


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


    def setup_project(self, new_account, data_modifier=''):
        """ """
        previous_n_projects = Project.objects.count()
        self.assertEqual(Account.objects.count(), 1)
        modified_project_data = dict(self.project_data)
        modified_project_data['title'] = modified_project_data['title'] + data_modifier
        response = self.client.post(self.project_url, modified_project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), previous_n_projects + 1)
        new_project = Project.objects.last()
        self.assertEqual(new_project.author, new_account)
        self.assertEqual(new_project.title, self.title + data_modifier)
        self.assertEqual(new_project.description, self.description)
        self.assertEqual(new_project.major, self.major)


    def setup_account_and_project(self):
        """ """
        self.assertEqual(Account.objects.count(), 0)
        new_account = self.setup_account()
        self.client.login(email=self.email, password=self.password)
        self.setup_project(new_account)
        return new_account


    def test_create_project_must_be_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project(self):
        """ Ensure we can create a new project object. """
        self.setup_account_and_project()


    def test_delete_project_must_be_authenticated(self):
        """ Can't delete a project when not signed in. """
        new_account = self.setup_account_and_project()
        self.client.logout()
        response = self.client.delete(ProjectTests.make_project_url(new_account))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_delete_project(self):
        """ DELETE a single project. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        response = self.client.delete(ProjectTests.make_project_url(new_account))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Project.objects.all()), 0)
        

    def test_update_project(self):
        """ PUT to edit a project. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.put(ProjectTests.make_project_url(new_account), 
                            self.project_data_edited, format='json')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        new_project = Project.objects.get()
        self.assertEqual(new_project.title, self.new_title)
        self.assertEqual(new_project.description, self.new_description)
        

    def test_get_single_project(self):
        """ GET a single project by author and project name. """
        new_account = self.setup_account_and_project()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.get(ProjectTests.make_project_url(new_account))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data), 7)
        self.assertEqual(get_response.data['author']['username'], self.username)
        self.assertEqual(get_response.data['title'], self.title)
        self.assertEqual(get_response.data['description'], self.description)
        self.assertEqual(get_response.data['major'], self.major)
        self.assertIn('created_at', get_response.data)
        self.assertIn('updated_at', get_response.data)


    def test_get_all_projects_by_user(self):
        new_account = self.setup_account_and_project()
        self.setup_project(new_account, '-appendtext')
        self.assertEqual(len(Project.objects.all()), 2)
        get_response = self.client.get('/api/v1/accounts/' + self.username + '/projects/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        print get_response.data
        self.assertEqual(len(get_response.data), 2) # should return 2 projects
        sorted_projects = sorted(get_response.data, key=lambda x: x.get('title'))
        self.assertEqual(sorted_projects[0]['title'], self.title)
        self.assertEqual(sorted_projects[1]['title'], self.title + '-appendtext')

