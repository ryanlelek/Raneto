
'use strict';

// Modules
var gulp = require('gulp');

gulp.task('copy_libs', function () {

  var source = [
    'node_modules/jquery/**/*',
    'node_modules/bootstrap/**/*',
    'node_modules/popper.js/**/*',
    'node_modules/bootstrap-rtl/**/*',
    'node_modules/fitvids/**/*',
    'node_modules/highlightjs/**/*',
    'node_modules/masonry-layout/**/*',
    'node_modules/sweetalert2/**/*',
    'node_modules/jquery-backstretch/**/*'
  ];

  var dest = 'themes/default/public/lib';

  return gulp
    .src(source, { base: 'node_modules' })
    .pipe(gulp.dest(dest));

});

// Default
gulp.task('default', gulp.series('copy_libs'));
