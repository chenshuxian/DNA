var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
//    plumber = require('gulp-plumber'),
var gutil = require('gulp-util'),
    webpack = require("webpack"),
    webpackDevConfig = require("./webpackDev.config.js"),
    webpackConfig = require("./webpack.config.js"),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass');

gulp.task("webpackDev", function(callback) {
    // run webpack
  var myConfig = Object.create(webpackDevConfig);
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack", function(callback) {
    // run webpack
  var myConfig = Object.create(webpackConfig);
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    callback();
  });
});
var myDevConfig = Object.create(webpackDevConfig);
myDevConfig.debug = true;
var devCompiler = webpack(myDevConfig);
gulp.task("webpack:build-dev", function(callback) {
	// run webpack
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    livereload({start: true});
    callback();
  });
});

gulp.task('sass', function() {
  return sass('./public/css/**/*.scss')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('jade', function() {
  livereload();
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/js/*.js', ['webpack:build-dev']);
  gulp.watch('./app/views/*.jade', ['jade']);
  livereload.listen();
});

gulp.task('develop', function() {
  // livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('dev', [
  'sass',
  'develop',
  'watch',
  'webpackDev'
]);

gulp.task('default', [
  'sass',
  'develop',
  'watch',
  'webpack'
]);
