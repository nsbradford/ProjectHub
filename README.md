# ProjectHub

## Installation

Create a Python virtual environment, install bower components, instantiate the database, and start the dev server.
	
	$ virtualenv env
	$ source env/bin/activate
	$ pip install -r requirements.txt
	$ npm install -g bower
	$ npm install
	$ bower install
	$ python manage.py migrate
	$ python manage.py runserver

## Helpful docs

* Django REST Framework [website](http://www.django-rest-framework.org) and [GitHub](https://github.com/encode/django-rest-framework/tree/24791cb353d1924086b30abe2188280547d9a6c4); documentation leaves a lot of missing details so looking directly at code is sometimes necessary.

## API Overview

* Pages handled by Angular:
    * index:          /
    * register:       /register
    * login:          /login
    * profile:        /+username
    * settings:       /+username/settings
* API AccountViewSet:
    * POST (create)   '/api/v1/accounts/', profile data
    * PUT (update)    '/api/v1/accounts/' + profile.username + '/', profile data
    * GET             '/api/v1/accounts/' + username + '/'
    * DELETE          '/api/v1/accounts/' + profile.id + '/'
* API ProjectViewSet and nested: 
    * GET (get all)   '/api/v1/projects/'
    * POST (create)   '/api/v1/projects/'
    * GET (get one)   '/api/v1/accounts/' + username + '/projects/'
* API LoginView:      api/v1/auth/login/
* API LogoutView:     api/v1/auth/logout/

## TODO

* Comment code
* Django tests
* E2E tests
* grunt-jsdoc: documentation generation from js comments
