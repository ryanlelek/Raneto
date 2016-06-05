
'use strict';

// Modules
var gulp = require('gulp');

gulp.task('copy_libs', function () {

  var source = [
    'node_modules/bootstrap/**/*',
    'node_modules/bootstrap-rtl/**/*',
    'node_modules/fitvids/**/*',
    'node_modules/highlightjs/**/*',
    'node_modules/jquery/**/*',
    'node_modules/masonry-layout/**/*',
    'node_modules/sweetalert/**/*',
    'node_modules/jquery.backstretch/**/*',
  ];

  var dest = 'themes/default/public/lib';

  return gulp.src(source, { base: 'node_modules' })
             .pipe(gulp.dest(dest));

});

// Default
gulp.task('default', ['copy_libs']);
