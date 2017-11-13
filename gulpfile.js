/**
 * Project Hub Gulp File
 * 
 * 1. build   -- ngAnnotate and uglify the JS.
 * 2. serve   -- Compile Scss and use Browse-Sync to show changes
 * 3. sass    -- Compile Scss
 * 4. default -- build and serve
 */

const gulp        = require('gulp');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');


gulp.task('build', function () {
  return gulp.src('static/javascripts/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/javascripts/'));
});

gulp.task('serve', ['sass'], function () {

  browserSync.init({
    notify: false,
    proxy: 'localhost:8000/'
});


    gulp.watch('static/stylesheets/**/*.scss', ['sass', browserSync.reload]);
    gulp.watch('{authentication,projecthub,projects,static/javascripts,static/templates,templates}/**/*.{scss,js,py,html}', browserSync.reload);
});

gulp.task('sass', function(){
  return gulp.src('static/stylesheets/scss/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError) 
    .pipe(gulp.dest('static/stylesheets/css'));
});


gulp.task('default', ['build']);
// gulp.task('default', ['serve','build']);