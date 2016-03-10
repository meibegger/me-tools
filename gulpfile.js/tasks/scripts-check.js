var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , plumber = require('gulp-plumber')
  , config = require('../config.json')
  ;

gulp.task('scripts-check', function () {
  return gulp.src(config.scripts.src)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
