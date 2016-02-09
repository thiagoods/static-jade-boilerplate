# Static-Jade-Boilerplate
Vanilla boilerplate for static sites using Jade, Sass and Gulp. The aim is to stay simple while providing a solid foundation to kickstart static jade projects. Convention over configuration!

## Includes:
  - gulp tasks for compiling Jade to HTML, Sass to CSS, concatenate JS and Browser Sync for development
  - Blogging ready through Markdown and front-matter syntax
  - a simple grid based in bootstrap v4
  - a scaffolding structure for building statics sites using templates, includes, mixins and data-files

### Powered by:
  * [jade](https://github.com/pugjs/jade)
  * [sass](https://github.com/sass/sass)
  * [gulp](https://github.com/gulpjs/gulp)

## How to get started
1. Download and install [NodeJS](https://nodejs.org/en/)

2. Install GulpJS globally
	```sh
	$ npm install --global gulp-cli
	```

3. Clone this repo
	```sh
	$ git clone https://github.com/thiagoods/static-jade-boilerplate.git new_project
	$ cd new_project
	```

4. Install the dependencies via npm
	```sh
	$ npm install
	```

5. You're good to go!

## Developing
### Folder structure
```sh
new_project -
    /dist -
        /css
            site.css
        /assets -
			/icons
			/img
        /js
            site.js
    /src -
        /css
			styles.scss
        /data
			blog.jade
			site.jade
		/includes
			head.jade
		/js
			modules.js
		/mixins
		/pages -
			index.jade
			404.jade
			/about
				index.jade
			/blog
				index.jade
				post.md
		/static -
			/assets -
				favicon.ico
				robots.txt
				/icons
				/img
				/imgmin
        /templates
			default.jade
			post.jade
		.csscomb.json
		.csslintrc.json
        .editorconfig
        .gitignore
		.jshintrc.json
		.stylestats.json
        Gulpfile.js
        package.json
        Readme.md
```
To add new pages, use the _about_ example, create a new folder inside /pages with an index.jade file inside.

### Gulp tasks
- gulp clean (self explanatory)
- gulp posts (copmile the markdown posts to HTML through Jade template)
- gulp html (compile Jade pages files to HTML)
- gulp css (compile SCSS to CSS)
- gulp js (concatenate and mminify Js)
- gulp static (copy static assets like images to dist folder)
- gulp imagemin (optimize images in imgmin folder)
- gulp browsersync (start the server for development)
- gulp dev (start the server and watch for changes in files)
- gulp _default_ (clean and generate the build)

### License
This boilerplate is free and open source software, distributed under the The MIT License. So feel free to use this to create your site without linking back to me or using a disclaimer.

If you’d like to give suggestions feel free to open an issue or ping me via @thiagoods_dev. Feel free to share!
