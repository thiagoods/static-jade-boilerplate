/*Required Packages*/
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    csslint = require('gulp-csslint'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    jsreporter = require('jshint-stylish'),
    imagemin = require('gulp-imagemin'),
    minifycss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    pngquant = require('imagemin-pngquant'),
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
gulp.task('clean', function(cb){
  del(['dist'], cb)
});

gulp.task('copy', function(){
  gulp.src(['src/*.*', '!src/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('image', function(){
  return gulp.src('src/_assets/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({quality: '60-75', speed: 2})]
    }))
    .pipe(gulp.dest('dist/assets'))
});

gulp.task('jekyll', function (cb){
    var spawn = require('child_process').spawn;
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
    jekyll.on('exit', function(code) {
      cb(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+ code);
    });
});

gulp.task('html',['jekyll'], function(){
  return gulp.src('dist/**/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true, once: true}))
});

gulp.task('css', function(){
  return gulp.src('src/_css/main.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true, once: true}))
});

gulp.task('cssanalyze', function(){
  return gulp.src('src/_css/main.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(csslint(csslintConfig))
    .pipe(csslint.reporter())
    .pipe(stylestats({config: stylestatsConfig}))
});

gulp.task('js', function(){
  return gulp.src('src/_js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream:true, once: true}))
});

gulp.task('jsanalyze', function(){
  return gulp.src('src/_js/*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('analyze', function(){
  gulp.start('cssanalyze', 'jsanalyze');
});

gulp.task('build', function(){
  gulp.start('html', 'css', 'js', 'image')
});

gulp.task('default', ['html', 'css', 'js', 'image'], function(){
  gulp.watch('src/_posts/*.markdown', ['html']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/_assets/**/*', ['image']);
  gulp.watch('src/_css/*.scss', ['css']);
  gulp.watch('src/_js/*.js', ['js']);
  gulp.start('browser-sync');
});
