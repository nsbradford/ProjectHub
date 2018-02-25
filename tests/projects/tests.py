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
from projects.models import Project, Major, Tag
from projects import views


class MajorTests(APITestCase):

    def test_get_all_majors(self):
        pass


class TagTests(APITestCase):

    def test_get_all_tags(self):
        pass



class ProjectTests(APITestCase):

    majors = ['Underwater Basket Weaving', 'Computer Science']
    tags = ['Academic', 'Startup']

    setup_data = {
                'email': 'johndoe@wpi.edu',
                'username': 'johndoe',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'tagline': 'This is the tagline for John Doe #1'
            }
    bad_user = {
                'email': 'bad@wpi.edu',
                'username': 'badguy',
                'password': 'hackerman666',
                'first_name': 'Bad',
                'last_name': 'Guy',
                'tagline': 'I am evil'
            }
    project_data = {
        'title': 'mytitle',
        'description': 'mydescription',
        'majors': majors,
        'tags': tags
    }
    project_data_edited = {
        'title': 'mytitle' + '-edited!',
        'description': 'mydescription' + '-edited!',
        'majors': majors,
        'tags': tags
    }
    accounts_url = '/api/v1/accounts/'
    project_url = '/api/v1/projects/'
    url_activate = '/api/v1/auth/activate/%s'


    @staticmethod
    def make_project_url(project):
        return ProjectTests.project_url + str(project.pk) + '/'


    def activate_account(self, new_account):
        good_token = new_account.get_confirmation_key()
        post_response = self.client.post(self.url_activate % good_token)
        self.assertEqual(post_response.status_code, status.HTTP_202_ACCEPTED)


    def login(self, payload=setup_data):
        self.client.login(email=payload['email'], password=payload['password'])


    def setUp(self):
        self.setup_account()
        major1 = Major.objects.create(title='Underwater Basket Weaving')
        major2 = Major.objects.create(title='Computer Science')
        tag1 = Tag.objects.create(title='Academic')
        tag2 = Tag.objects.create(title='Startup')


    def setup_account(self, payload=setup_data):
        """ Create an account."""
        Account.objects.create_user(
                            email=payload['email'],
                            username=payload['username'],
                            password=payload['password'],
                            first_name=payload['first_name'],
                            last_name=payload['last_name'],
                            tagline=payload['tagline'])



    def setup_project(self, new_account):
        """ Create a new project. """

        project = Project.objects.create(
                                author=new_account,
                                title=self.project_data['title'],
                                description=self.project_data['description'],
                            )
        project.majors = Major.objects.all()
        project.tags = Tag.objects.all()
        return project


    def create_project(self, new_account, payload):
        """ Create a new project and confirm the fields are set correct. """
        previous_n_projects = Project.objects.count()
        self.assertEqual(Account.objects.count(), 1)
        response = self.client.post(self.project_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), previous_n_projects + 1)
        new_project = Project.objects.last()
        self.assertEqual(new_project.author, new_account)
        self.assertEqual(new_project.title, payload['title'])
        self.assertEqual(new_project.description, payload['description'])
        self.assertQuerysetEqual(new_project.majors.all(), map(repr, Major.objects.all()), ordered=False)
        self.assertQuerysetEqual(new_project.tags.all(), map(repr, Tag.objects.all()), ordered=False)


    def activate_login_and_setup_project(self):
        """ Activate account, login, and setup a new project. """
        new_account = Account.objects.last()
        self.activate_account(new_account)
        self.login()
        self.setup_project(new_account)
        return new_account


    # test CREATE

    def test_create_project(self):
        """ Ensure we can create a new project object. """
        new_account = Account.objects.last()
        self.activate_account(new_account)
        self.login()
        self.create_project(new_account, payload=self.project_data)


    def test_create_project_fails_when_not_authenticated(self):
        """ Ensure we get 403 FORBIDDEN when posting while unauthenticated. """
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_project_fails_when_not_activated(self):
        """ Get 403 Forbidden if posting from an account without an activated email."""
        self.login()
        response = self.client.post(self.project_url, self.project_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    # test READ

    def test_get_single_project(self):
        """ GET a single project by author and project name. """
        new_account = Account.objects.last()
        self.setup_project(new_account)
        new_project = Project.objects.last()
        get_response = self.client.get(ProjectTests.make_project_url(new_project))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)

        # could do this with json.loads(response.content) as well
        self.assertEqual(len(get_response.data), 8)
        self.assertEqual(get_response.data['author']['username'], self.setup_data['username'])
        self.assertEqual(get_response.data['title'], self.project_data['title'])
        self.assertEqual(
            sorted(get_response.data['majors']), 
            sorted(map(unicode, self.majors))
        )
        self.assertEqual(
            sorted(get_response.data['tags']), 
            sorted(map(unicode, self.tags))
        )


    def test_get_all_projects_by_user(self):
        self.activate_login_and_setup_project()
        new_account = Account.objects.last()
        self.create_project(new_account, payload=self.project_data_edited)
        self.assertEqual(len(Project.objects.all()), 2)
        get_response = self.client.get('/api/v1/accounts/' + self.setup_data['username'] + '/projects/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data), 2)
        sorted_projects = sorted(get_response.data, key=lambda x: x.get('title'))
        self.assertEqual(sorted_projects[0]['title'], self.project_data['title'])
        self.assertEqual(sorted_projects[1]['title'], self.project_data_edited['title'])


    # test UPDATE

    def test_update_project(self):
        """ PUT to edit a project. """
        self.activate_login_and_setup_project()
        new_project = Project.objects.last()
        self.assertEqual(len(Project.objects.all()), 1)
        get_response = self.client.put(ProjectTests.make_project_url(new_project),
                            self.project_data_edited, format='json')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        new_project = Project.objects.last()
        self.assertEqual(new_project.title, self.project_data_edited['title'])
        self.assertEqual(new_project.description, self.project_data_edited['description'])


    def test_update_project_fails_for_wrong_user(self):
        new_account = Account.objects.last()
        new_project = self.setup_project(new_account)
        self.setup_account(payload=self.bad_user)
        self.login(payload=self.bad_user)
        put_response = self.client.put(ProjectTests.make_project_url(new_project),
                    self.project_data_edited, format='json')
        self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)


    # test DESTROY

    def test_delete_project(self):
        """ DELETE a single project. """
        self.activate_login_and_setup_project()
        new_project = Project.objects.last()
        self.assertEqual(len(Project.objects.all()), 1)
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Project.objects.all()), 0)


    def test_delete_project_fails_when_not_authenticated(self):
        """ Can't delete a project when not signed in. """
        new_account = Account.objects.last()
        self.setup_project(new_account)
        new_project = Project.objects.last()
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_delete_project_fails_for_wrong_user(self):
        """ Can't delete the project of another user. """
        new_account = Account.objects.last()
        new_project = self.setup_project(new_account)
        self.setup_account(payload=self.bad_user)
        self.login(payload=self.bad_user)
        response = self.client.delete(ProjectTests.make_project_url(new_project))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

