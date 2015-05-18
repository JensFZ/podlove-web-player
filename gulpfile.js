'use strict';

// Load plugins
var gulp = require('gulp')
  , sass = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , minifycss = require('gulp-minify-css')
  , eslint = require('gulp-eslint')
  , uglify = require('gulp-uglify')
  , imagemin = require('gulp-imagemin')
  , rename = require('gulp-rename')
  , clean = require('gulp-clean')
  , concat = require('gulp-concat')
// deactivate caching until issue is resolved
//  , cache = require('gulp-cache')
  , browserify = require('gulp-browserify')
  , browserSync  = require('browser-sync')
  , reload = browserSync.reload
  , karma = require('karma').server
  , _ = require('lodash')

  , karmaConf = require('./karma.conf.json')

// set paths
  , bower = 'bower_components/'
  , source = 'src/'
  , dest = 'dist/'
  , external = 'vendor/'
  ;

gulp.task('lint', function () {
  // Note: To have the process exit with an error code (1) on
  //  lint error, return the stream and pipe to failOnError last.
  return gulp.src([source + 'js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  var singleRunConf = _.assign({}, karmaConf, {singleRun: true});
  karma.start(singleRunConf, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  karma.start(karmaConf, done);
});

// Styles
gulp.task('styles', function() {
  return gulp.src(source + 'sass/pwp-*.scss')


    .pipe(sass().on('error', sass.logError))


    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(dest + 'css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(dest + 'css'))
    .pipe(reload({stream: true}))
});

gulp.task('moderator', function() {
  return gulp.src(source + 'js/moderator.js')
    .pipe(browserify({ insertGlobals : true, debug : true }))
    .pipe(rename('podlove-web-moderator.js'))
    .pipe(gulp.dest(dest + 'js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dest + 'js'))
    .pipe(reload({stream: true}))
});

gulp.task('player', function() {
  return gulp.src(source + 'js/app.js')
    .pipe(browserify({ insertGlobals : true, debug : true }))
    .pipe(rename('podlove-web-player.js'))
    .pipe(gulp.dest(dest + 'js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dest + 'js'))
    .pipe(reload({stream: true}))
});

// Scripts
gulp.task('scripts', ['player', 'moderator']);

// Images
gulp.task('images', function() {
  return gulp.src(source + 'img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(dest + 'img'))
    .pipe(reload({stream: true}))
});

// copy lib files
gulp.task('copy', function() {
  // Copy MediaElement fallbacks
  gulp.src(bower + 'mediaelement/build/flashmediaelement.swf')
    .pipe(gulp.dest(dest + 'bin'));
  gulp.src(bower + 'mediaelement/build/silverlightmediaelement.xap')
    .pipe(gulp.dest(dest + 'bin'));

  // Copy external JS-libs
  gulp.src(bower + 'html5shiv/dist/*')
    .pipe(gulp.dest(dest + 'js/' + external));
  gulp.src(bower + 'jquery/dist/*')
    .pipe(gulp.dest(dest + 'js/' + external));

  // Copy progress polyfill JS and CSS
  gulp.src(bower + 'progress-polyfill/*.css')
    .pipe(gulp.dest(dest + 'css/' + external));
  gulp.src(bower + 'progress-polyfill/*.js')
    .pipe(gulp.dest(dest + 'js/' + external));

  // Copy Podlove Font
  gulp.src(bower + 'podlove-font/font/*')
    .pipe(gulp.dest(dest + 'font'));
});

// copy example files
gulp.task('examples', function() {
  // main documentation index html
  gulp.src(source + '*.html')
    .pipe(gulp.dest(dest))
    .pipe(reload({stream: true}));

  // all media examples
  gulp.src(source + 'examples/**/*.*')
    .pipe(gulp.dest(dest + 'examples'))
    .pipe(reload({stream: true}));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(dest, {read: false})
    .pipe(clean())
});

// build distribution package
gulp.task('build', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'copy', 'examples');
});

// Default task
gulp.task('default', ['lint', 'test'], function() {
  gulp.start('build');
});

// Watch
gulp.task('watch', function() {
  browserSync({
    server: {
        baseDir: "./dist/"
    }
  });

  // Watch Sass source files
  gulp.watch(source + 'sass/**/*.scss', ['styles']);

  // Watch Javascript source files
  gulp.watch(source + 'js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch(source + 'img/**/*', ['images']);

  // Watch example files
  gulp.watch(source + '*.html', ['examples']);

});

// Serve
gulp.task('serve', ['build', 'watch']);

