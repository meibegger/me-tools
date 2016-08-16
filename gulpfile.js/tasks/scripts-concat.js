var
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps');


var
  header = require('gulp-header'),
  footer = require('gulp-footer'),
  pkg = require('../../package.json'),
  config = require('../config.json'),
  banner = config.scripts.banner || [];

gulp.task('scripts-concat', ['scripts-check'], function (taskReady) {
  return gulp.src(config.scripts.concat.src)
    .pipe(sourcemaps.init())
    .pipe(concat(config.scripts.concat.dest + '.js'))
    .pipe(header(banner.join('\n'), { pkg : pkg } ))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(rename(config.scripts.concat.dest + '.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(footer('\n'+banner.join('\n'), { pkg : pkg } ))
    .pipe(gulp.dest(config.scripts.dest));
});

//gulp.task('scripts-concat',['scripts-check','scripts-concat']);
