var gulp = require('gulp')
  , del = require('del')
  , config = require('../config.json')
  ;

gulp.task('clean', function () {
  return del(config.clean);
});
