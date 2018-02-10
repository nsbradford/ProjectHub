# ProjectHub

Visit us at https://www.goprojecthub.com

## About

### Why ProjectHub?

https://www.goprojecthub.com/about

ProjectHub started in 2017 to connect collaborators on all kinds of projects: startups, academic projects, research, and more.

Currently, students or professors trying to find interesting work or recruit teammates are limited to spamming large email aliases and hoping for the best. That's terrible for everyone; you're inundated with irrelevant material, and there's no searchable centralized repository for when you decide to go looking.

Instead, ProjectHub provides a simple, generic, and flexible platform where anyone can search for projects or collaborators.

### Our plan

Short-term, this site provides a service to the WPI community for all kinds of projects, including both students and professors. The Dean's office, Department Heads, some Trustees, and others are on board and excited about this. Long-term, we'll be expanding other other schools to build a valuable network of collaborators. 

### Recruitment

https://www.goprojecthub.com/projects/+4

We're looking for additional developers - we use {Heroku, Django, Angular} but no prior experience necessary - all you'll need to do is complete the Django+Angular tutorials and you'll be ready to go in a couple hours.

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

For it to fully work, you'll need to define your own `components/settings_dev.py` file based off `components/settings_dev_template.py` with sensitive data (SECRET_KEY, database/email passwords, etc.) that you don't want committed to source control.

## Structure Overview

    /authentication                 Django backend for Account and permissions
    /dist                           minified JS for deployment
    /env                            Python virtual env
    /node_modules                   Node local packages downloaded
    /projecthub                     Django project config and URL setup
        /components
            settings_dev_template.py
            settings_production.py
    /projects                       Django backend for Project
    /scripts                        bash scripts
    /static                         static content
        /bower_components               Bower local packages downloaded
        /javascripts                    All JS
            /authentication                 Controllers and services
            /layout                         Controllers for index and navbar
            /profiles                       Controllers and services
            /projects                       Controllers, directives, and services
            /utils                          Service for snackbar
            projecthub.config.js            Minor configs
            projecthub.routes.js            Routing URL -> [controller, html template]
            projecthub.js                   Module dependencies and CSRF config
        /stylesheets                    styles.css
        /templates                      templates for Angular
            /authentication                 login, register
            /layout                         index
            /profiles                       profile, settings
            /projects                       discover-projects, new-project, project
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

Make sure the `Procfile` points to `wsgi.py`, and `requirements.txt` is up to date. 

    $ heroku login // authenticate

We need both the python and node buildpacks:

    $ heroku buildpacks:add --index 1 heroku/python
    $ heroku buildpacks:add --index 1 heroku/nodejs

Deployment occurs through git push:
    
    $ git push heroku master // deploy from our master branch to the Heroku master
    $ git push heroku deploy-heroku:master // deploy from a local deployment branch to Heroku

Fun things to do:
    
    $ heroku local web                  // locally test Heroku (very imperfect)
    $ heroku run bash                   // run bash on one-off dyno
    $ heroku run python manage.py shell // manage Django on one-off dyno

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
    * PUT (update)    '/api/v1/projects/' + id + '/', project data
    * GET (a user's)  '/api/v1/accounts/' + username + '/projects/'
    * GET (get one)   '/api/v1/projects/' + id + '/'
    * DELETE          '/api/v1/projects/' + id + '/'
* API LoginView:      
    * POST              'api/v1/auth/login/'
* API LogoutView:       
    * POST              'api/v1/auth/logout/'
* API ActivateAccount
    * POST              'api/v1/auth/activate/' + key  
* API ResendEmail
    * POST              'api/v1/auth/resend/'

