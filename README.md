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

## Structure Overview

    /authentication                 Django backend for Account and permissions
    /dist                           minified JS for deployment
    /env                            Python virtual env
    /node_modules                   Node local packages downloaded
    /projecthub                     Django project config and URL setup
    /projects                       Django backend for Project
    /scripts                        bash scripts
    /static                         static content
        /bower_components           Bower local packages downloaded
        /javascripts                All JS
            /authentication         Controllers and services
            /layout                 Controllers for index and navbar
            /profiles               Controllers and services
            /projects               Controllers, directives, and services
            /utils                  Service for snackbar
            projecthub.config.js    Minor configs
            projecthub.routes.js    Routing URL -> [controller, html template]
            projecthub.js           Module dependencies and CSRF config
        /stylesheets                styles.css
        /templates                  templates for Angular
            /authentication         login, register
            /layout                 index
            /profiles               profile, settings
            /projects               discover-projects, new-project, project
    /templates                      Basic header/js templates used by Django
    .bowerrc                        Bower set components directory
    .buildpacks                     Heroku buildpacks config
    .gitignore                      Ignore in Git
    bower.json                      Bower config
    db.sqlite3                      Local
    gulpfile.js                     Gulp config
    manage.py                       Django manager
    package.json                    Node config
    Procfile                        Heroku config
    requirements.txt                Python package requirements
    runtime.txt                     Heroku specify Python version

## Deploying to Heroku

    $ git push heroku deploy-heroku:master

Fun things to do:
    
    $ heroku run bash
    $ heroku run python manage.py shell

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
    * DELETE          '/api/v1/accounts/' + profile.username + '/'
* API ProjectViewSet and nested: 
    * GET (get all)   '/api/v1/projects/'
    * POST (create)   '/api/v1/projects/', project data
    * PUT (update)    '/api/v1/projects/' + pk + '/', project data
    * GET (a user's)  '/api/v1/accounts/' + username + '/projects/'
    * GET (get one)   '/api/v1/projects/' + pk + '/'
    * DELETE          '/api/v1/projects/' + pk + '/'
* API LoginView:      api/v1/auth/login/
* API LogoutView:     api/v1/auth/logout/

