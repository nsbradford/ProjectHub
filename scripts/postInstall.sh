#!/bin/bash

./node_modules/bower/bin/bower install
./node_modules/gulp/bin/gulp.js

#source ./env/bin/activate
./manage.py loaddata majors