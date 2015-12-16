/*Required Packages*/
var gulp = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync'),
		concat = require('gulp-concat'),
		csslint = require('gulp-csslint'),
		del = require('del'),
		jade = require('gulp-jade'),
		jshint = require('gulp-jshint'),
		jsreporter = require('jshint-stylish'),
		imagemin = require('gulp-imagemin'),
		minifycss = require('gulp-minify-css'),
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
