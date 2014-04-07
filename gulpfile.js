var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var connect = require('connect');
var http = require('http');
var minifyCSS = require('gulp-minify-css');
var lr = require('tiny-lr')();
var open = require('open');
var imagemin = require('gulp-imagemin');

var SERVER_PORT = 9000;
var SERVER_DOMAIN = 'localhost';
var LIVE_RELOAD_PORT = 35729;

var appDir = 'app';
var distDir = 'dist';

function notifyLivereload(event) {
  var fileName = require('path').relative(__dirname + '/' + appDir, event.path);
 
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('connect', function() {
  var app = connect()
    .use(connect.logger('dev'))
    .use(require('connect-livereload')())
    .use(connect.static('app'))
    .use(connect.directory( appDir ));

  http.createServer( app ).listen( SERVER_PORT );
});

gulp.task('livereload', function() {
  lr.listen( LIVE_RELOAD_PORT );
});

gulp.task('sass', function () {
    gulp.src(appDir + '/styles/**/*.sass')
        .pipe(sass())
        .pipe(gulp.dest(appDir + '/styles'));
});

gulp.task('minifyCSS', function() {
  gulp.src(appDir + '/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest( distDir ));
});

gulp.task('copyHTML', function() {
  gulp.src(appDir + '/*.html')
        .pipe(gulp.dest( distDir ));
});

gulp.task('optimiseImages', function() {
  gulp.src(appDir + '/images/*')
      .pipe(imagemin())
      .pipe(gulp.dest(distDir + '/images'));
});

gulp.task('watch', function () {
  gulp.watch(['**/*.html'], notifyLivereload);
  gulp.watch(['**/*.css'], notifyLivereload);
  gulp.watch(['**/*.sass'], ['sass']);
});

gulp.task('open', function() {
  open('http://' + SERVER_DOMAIN + ':' + SERVER_PORT);
});

gulp.task('server', [ 'livereload', 'connect', 'watch', 'open' ]);

gulp.task('build', [ 'minifyCSS', 'copyHTML', 'optimiseImages' ]);




