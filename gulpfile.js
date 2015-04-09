var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var gulpStylus = require('gulp-stylus');
var gulpBower = require('gulp-bower');
var livereload = require('gulp-livereload');
var NwBuilder = require('node-webkit-builder');
var gulpJsonEditor = require('gulp-json-editor');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var gulpMinifyCss = require('gulp-minify-css');
var gulpGm = require('gulp-gm');
var mergeStreams = require('merge-stream');
var path = require('path');

// The default task simply runs all the compile tasks.
gulp.task('default', [
  'compile-html',
  'compile-css',
  'compile-js',
  'compile-bower',
  'process-data',
  'process-images'
]);

// Find all Jade templates and compile them into HTML.
gulp.task('compile-html', function () {
  // Compile the index file.
  var indexTemplate = gulp.src('./src/index.jade')
    .pipe(gulpJade())
    .pipe(gulp.dest('./build'))
    .pipe(livereload());

  // Compile all other templates.
  var otherTemplates = gulp.src('./src/templates/**/*.jade')
    .pipe(gulpJade())
    .pipe(gulp.dest('./build/templates'))
    .pipe(livereload());
  
  mergeStreams(indexTemplate, otherTemplates);
});

// Compile all Stylus files into proper CSS files.
gulp.task('compile-css', function () {
  // Compile all Stylus files.
  var styles = gulp.src('./src/css/*.styl')
    .pipe(gulpStylus())
    .pipe(gulpMinifyCss())
    .pipe(gulp.dest('./build/css'))
    .pipe(livereload());

  return styles;
});

// Move all JavaScript files to the appropriate destination.
gulp.task('compile-js', function () {
  // Deploy all JavaScript files.
  var js = gulp.src('./src/js/**/*.js')
    //.pipe(gulpUglify({mangle:false}))
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload());

  return js;
});

// Move all bower libs to the built libs directory.
gulp.task('compile-bower', function () {
  // Deploy all bower dependencies.
  var libs = gulpBower('./src/bower_components')
    .pipe(gulp.dest('./build/lib/'))
    .pipe(livereload());

  return libs;
});

// Move card images and generate thumbnails.
gulp.task('process-images', function () {
  // Copy all source images.
  var images = gulp.src('./src/imgs/**/*')
    .pipe(gulp.dest('./build/imgs/'))
    .pipe(livereload());

  // Crop card images to generate decklist thumbnails.
  var cardThumbnails = gulp.src('./src/imgs/card-images/*')
    .pipe(gulpGm(function (gmFile) {
      // API: gmFile.crop(width, height, x, y)
      return gmFile.crop(120, 40, 80, 110);
    }, { imageMagick: true }))
    .pipe(gulp.dest('./build/imgs/cards/thumbnails'))
    .pipe(livereload());

  return mergeStreams(images, cardThumbnails);
});

// Transform card data and move template decks.
gulp.task('process-data', function () {
  // Transform card data into a flat array.
  var cardData = gulp.src('./src/data/all-sets.json').pipe(gulpJsonEditor(function (cardSets) {
    var cards = [];
    Object.keys(cardSets).forEach(function (setName) {
      cards = cards.concat(cardSets[setName]);
    });
    var cardMap = {};
    cards.forEach(function (card) {
      cardMap[card.id] = card;
    });
    return cardMap;
  })).pipe(gulpRename('cards.json')).pipe(gulp.dest('./build/data'));;

  // Move template decks.
  var defaultDecks = gulp.src('./src/data/decks/*')
    .pipe(gulp.dest('./build/data/decks'))
    .pipe(livereload());

  return mergeStreams(cardData, defaultDecks);
});

// Run all compile tasks, start a livereload server, and add some watcher messages.
gulp.task('watch', ['default'], function () {
  // The change event is the same for all the watchers.
  var onChange = function (event) {
    var filePath = path.relative('./', event.path);
    console.log('%s %s', filePath, event.type);
  };

  // Detect changes to all relevant files and trigger the appropriate task.
  gulp.watch('./src/**/*.jade', ['compile-html']).on('change', onChange);
  gulp.watch('./src/css/**/*.styl', ['compile-css']).on('change', onChange);
  gulp.watch('./src/js/**/*.js', ['compile-js']).on('change', onChange);
  gulp.watch('./src/data/all-sets.json', ['process-data']).on('change', onChange);;
  gulp.watch('./src/data/decks/*', ['process-data']).on('change', onChange);;
  gulp.watch('./src/imgs/**/*', ['process-images']).on('change', onChange);;

  // Start livereload server to wait for piped filenames.
  livereload.listen({ basePath: './build' });
});

// Run all compile tasks and then build executables for the application.
gulp.task('deploy', ['default'], function () {
  // Instantiate Nwbuilder.
  var nw = new NwBuilder({
    files: ['./package.json', './build/**/*'], // use the glob format
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
