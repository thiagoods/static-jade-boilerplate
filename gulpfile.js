/*Required Packages*/
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    csscomb = require('gulp-csscomb'),
    csslint = require('gulp-csslint'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    jsreporter = require('jshint-stylish'),
    minifycss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    stylestats = require('gulp-stylestats'),
    uglify = require('gulp-uglify');

/*Configuration Files*/
var autoprefixerConfig = {browsers: ['last 2 version', 'ie 9', 'ios 6', 'android 4']},
    csslintConfig = require('./.csslintrc.json'),
    jshintConfig = require('./.jshintrc.json'),
    stylestatsConfig = require('./.stylestats.json');

/*Tasks*/
gulp.task('clean', function(cb) {
  del(['dist'], cb)
});

gulp.task('copy', function(){
  gulp.src('src/_assets/**/*')
    .pipe(gulp.dest('dist/assets'));
  gulp.src('src/*.*')
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
  return gulp.src('src/_pages/**/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('css', function(){
  gulp.src(['src/_css/*.scss', '!src/_css/style.scss'])
    .pipe(csscomb())
    .pipe(gulp.dest('src/_css'));
  return gulp.src('src/_css/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(csscomb())
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('css-analyze', function(){
  return gulp.src('src/_css/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(csslint(csslintConfig))
    .pipe(csslint.reporter())
    .pipe(stylestats({config: stylestatsConfig}))
});

gulp.task('js', function() {
  return gulp.src('src/_js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('js-analyze', function() {
  return gulp.src('src/_js/*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('analyze', function() {
  gulp.start('css-analyze', 'js-analyze');
});

gulp.task('build', ['html', 'css', 'js', 'copy']);

gulp.task('serve', ['build'], function() {
  gulp.watch('src/_css/*.scss', ['css']);
  gulp.watch('src/_js/*.js', ['js']);
  gulp.watch('src/_pages/**/*.html', ['html']);
  gulp.start('browser-sync');
});
