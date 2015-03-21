var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var gulpStylus = require('gulp-stylus');
var gulpBower = require('gulp-bower');
var livereload = require('gulp-livereload');
var NwBuilder = require('node-webkit-builder');
var path = require('path');

// The default task simply runs all the compile tasks.
gulp.task('default', ['compile-html', 'compile-css', 'compile-js', 'compile-bower']);

// Find all Jade templates and compile them into HTML.
gulp.task('compile-html', function () {
  // Compile the index file.
  gulp.src('./src/index.jade')
    .pipe(gulpJade())
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());

  // Compile all other templates.
  gulp.src('./src/templates/*.jade')
    .pipe(gulpJade())
    .pipe(gulp.dest('./dist/templates'))
    .pipe(livereload());
});

// Compile all Stylus files into proper CSS files.
gulp.task('compile-css', function () {
  // Compile all Stylus files.
  gulp.src('./src/css/*.styl')
    .pipe(gulpStylus())
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

// Move all JavaScript files to the appropriate destination.
gulp.task('compile-js', function () {
  // Deploy all JavaScript files.
  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

// Move all bower libs to the distribution libs directory.
gulp.task('compile-bower', function () {
  // Deploy all bower dependencies.
  gulpBower('./src/bower_components')
    .pipe(gulp.dest('./dist/lib/'));
});

// Run all compile tasks, start a livereload server, and add some watcher messages.
gulp.task('watch', ['default'], function () {
  // Begin listening for livereload.
  livereload.listen({ basePath: './dist' });

  // The change event is the same for all the watchers.
  var onChange = function (event) {
    var filePath = path.relative('./', event.path);
    console.log('%s %s', filePath, event.type);
  };

  // Detect changes to all relevant files and trigger the appropriate task.
  gulp.watch('./src/**/*.jade', ['compile-html']).on('change', onChange);
  gulp.watch('./src/css/*.styl', ['compile-css']).on('change', onChange);
  gulp.watch('./src/js/**/*.js', ['compile-js']).on('change', onChange);
  gulp.watch('./src/bower_components/**/*', ['compile-bower']).on('change', onChange);
});

// Run all compile tasks and then build executables for the application.
gulp.task('deploy', ['default'], function () {
  // Instantiate Nwbuilder.
  var nw = new NwBuilder({
    files: ['./package.json', './dist/**/*'], // use the glob format
    platforms: ['osx32', 'osx64', 'win32', 'win64'],
    buildDir: './release'
  });

  // If the builder fires a log event, log it to the console.
  nw.on('log',  console.log.bind(console));

  // Build returns a promise so that gulp can handle any errors it generates.
  return nw.build().then(function () {
     console.log('all done!');
  });
});
