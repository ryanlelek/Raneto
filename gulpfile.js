var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', ['copy_libs']);

gulp.task('copy_libs', function() {
  var source = [
    'node_modules/bootstrap/**/*',
    'node_modules/fitvids/**/*',
    'node_modules/highlightjs/**/*',
    'node_modules/jquery/**/*',
    'node_modules/masonry-layout/**/*',
    'node_modules/sweetalert/**/*',
    'node_modules/jquery.backstretch/**/*',
  ];

  var dest = 'public/lib';

  var stream = gulp.src(source, { base: 'node_modules' })
    .pipe(gulp.dest(dest));

  return stream;
});
