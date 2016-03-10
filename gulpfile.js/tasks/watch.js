var gulp = require('gulp')
  , config = require('../config.json')
  ;

gulp.task('watch', function() {
  for (var i in config.watch) {
    gulp.watch(config.watch[i].files,config.watch[i].tasks);
  }
});
