var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');


gulp.task('serve', ['sass'], function() {

  browserSync.init({
    notify: false,
    proxy: "localhost:8000/"
});


    gulp.watch('static/stylesheets/sass/**/*.scss', ['sass',browserSync.reload]);
    gulp.watch('{authentication,projecthub,projects,static/javascripts,static/templates,templates}/**/*.{scss,js,py,html}', browserSync.reload);
});

gulp.task('sass', function(){
  return gulp.src('static/stylesheets/sass/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError) 
    .pipe(gulp.dest('static/stylesheets/css'))
});


gulp.task('default', ['serve']);