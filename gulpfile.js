/*Required Packages*/
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	csslint = require('gulp-csslint'),
	cssnano = require('gulp-cssnano'),
	del = require('del'),
	frontMatter = require('front-matter'),
	jade = require('jade'),
	jshint = require('gulp-jshint'),
	marked = require('marked'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	vinylMap = require('vinyl-map');

/*Configuration Files*/
var csslintConfig = require('./.csslintrc.json'),
	cssNanoConfig = {autoprefixer: {browsers: ['last 2 version', 'ie 10', 'ios 7', 'android 4']}, discardUnused: false, minifyFontValues: false},
	jadeOpts = { basedir: './src', pretty: '' },
	jshintConfig = require('./.jshintrc.json'),
	version = Date.now();

/* helper functions */
var renderPage = function(content, filename) {
	var fn = jade.compileFile(filename, jadeOpts);
	return fn();
};

var renderPost = function(content, filename) {
	var jadeTemplate = jade.compileFile('./src/templates/post.jade', jadeOpts);
	var parsed = frontMatter(String(content));
	var data = parsed.attributes;
	var body = parsed.body;
	body = marked.parse(body);
	data.content = body;
	data.filename = filename;
	return jadeTemplate(data);
};

/*Tasks*/
	gulp.task('clean', function() {
		return del('./dist');
	});

	gulp.task('posts', function() {
		return gulp.src('./src/pages/blog/*.md')
			.pipe(vinylMap(renderPost))
			.pipe(replace('{{version}}', version))
			.pipe(rename({extname: '.html'}))
			.pipe(gulp.dest('./dist/blog'))
			.pipe(browserSync.stream());
	});

	gulp.task('html', function(){
		return gulp.src('./src/pages/**/*.jade')
			.pipe(vinylMap(renderPage))
			.pipe(replace('{{version}}', version))
			.pipe(rename({extname: '.html'}))
			.pipe(gulp.dest('./dist'))
			.pipe(browserSync.stream());
	});

	gulp.task('sitemap', function(){
		return gulp.src('./src/pages/sitemap.jade')
			.pipe(vinylMap(renderPage))
			.pipe(rename({extname: '.xml'}))
			.pipe(gulp.dest('./dist'))
	});

	gulp.task('css', function(){
		return gulp.src('./src/css/site.scss')
			.pipe(sass())
			.pipe(replace('{{version}}', version))
			.pipe(csslint(csslintConfig))
			.pipe(csslint.reporter())
			.pipe(gulp.dest('./dist/css'))
			.pipe(cssnano(cssNanoConfig))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('./dist/css'))
			.pipe(browserSync.stream());
	});

	gulp.task('js', function(){
		return gulp.src(require('./src/js/modules.js'))
			.pipe(jshint(jshintConfig))
			.pipe(jshint.reporter('default'))
			.pipe(jshint.reporter('fail'))
			.pipe(concat('site.js'))
			.pipe(gulp.dest('./dist/js'))
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('./dist/js'))
			.pipe(browserSync.stream());
	});

	gulp.task('static', function() {
		return gulp.src('./src/static/**/*')
			.pipe(gulp.dest('./dist'))
			.pipe(browserSync.stream());
	});

	gulp.task('browsersync', function() {
		browserSync({
			ghostMode: {
				clicks: true,
				forms: true,
				location: true,
				scroll: true
			},
			server: {
				baseDir: './dist'
			},
			watchTask: true
		});
	});

	gulp.task('default', ['clean'], function() {
		gulp.start('html', 'posts', 'css', 'js', 'static', 'sitemap');
	});

	gulp.task('dev', ['html', 'posts', 'css', 'js', 'static'], function(){
		gulp.start('browsersync');
		gulp.watch('./src/+(data|includes|mixins|pages|templates)/**/*.jade', { debounceDelay: 400 }, ['html', browserSync.reload])
		gulp.watch('./src/pages/blog/*.md', ['posts'])
		gulp.watch('./src/css/*.scss', ['css'])
		gulp.watch('./src/js/*.js', ['js'])
		gulp.watch('./src/static/**/*', ['static'])
	});
