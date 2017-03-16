/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
  public: './public/',
  sass: './src/sass/',
  css: './public/css/',
  data: './src/_data/',
  imgSrc: './src/img/**',
  imgDest: './public/img',
  fonts: './public/fonts'
};

/**
 * Compress only new image files and
 * put the minified result to the public directory
 */
gulp.task('images', function() {
  return gulp.src(paths.imgSrc)
      .pipe(newer(paths.imgDest))
      .pipe(imagemin())
      .pipe(gulp.dest(paths.imgDest));
});

// fonts

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(paths.fonts));
});


/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    // .pipe(data(function (file) {
    //   return require(paths.data + path.basename(file.path) + '.json');
    // }))
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});

/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug', 'images', 'fonts'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch([(paths.sass + '**/*.sass'), (paths.sass + '**/*.scss')], ['sass']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
  gulp.watch(['src/img/**/*'], ['images']);
});

// Build task compile sass, pug and minify images.
gulp.task('build', ['sass', 'pug', 'images']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
