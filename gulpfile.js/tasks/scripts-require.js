
var gulp = require('gulp')
  , extend = require('extend')
  , requirejs = require('requirejs')
  , header = require('gulp-header')
  , footer = require('gulp-footer')
  , pkg = require('../../package.json')
  , config = require('../config.json')
  , banner = config.scripts.banner || []
;

/*
gulp.task('scripts-requirejsX', ['scripts-check'], function () {
  rjs(config.scripts.require)
    .pipe(header(banner.join('\n'), { pkg : pkg } ))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: function(node,comment) {
        return comment.line===1;
      }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.scripts.dest))
});
*/

gulp.task('scripts-requirejs', ['scripts-check'], function (taskReady) {
  var rConf = {}
    , fName = config.scripts.require.out + '.js';
  extend (true, rConf, config.scripts.require, {
    out: fName,
    optimize: 'none'
  });

  requirejs.optimize(rConf, function () {
    gulp.src(rConf.out)
      .pipe(header(banner.join('\n'), { pkg : pkg } ))
      .pipe(gulp.dest(config.scripts.dest));

    taskReady();

  }, function (error) {
    console.error('requirejs task failed', JSON.stringify(error))
    process.exit(1);
  });
});

gulp.task('scripts-requirejs-min', ['scripts-check'], function (taskReady) {
  var rConf = {}
    , fName = config.scripts.require.out + '.min.js';
  extend (true, rConf, config.scripts.require, {
    out: fName,
    optimize: 'uglify2',
    generateSourceMaps: true,
    preserveLicenseComments: false
  });

  requirejs.optimize(rConf, function () {
    gulp.src(rConf.out)
      .pipe(footer('\n'+banner.join('\n'), { pkg : pkg } ))
      .pipe(gulp.dest(config.scripts.dest));

    taskReady();

  }, function (error) {
    console.error('requirejs task failed', JSON.stringify(error))
    process.exit(1);
  });
});

gulp.task('scripts-require',['scripts-check','scripts-requirejs']);
gulp.task('scripts-require-min',['scripts-check','scripts-requirejs-min']);