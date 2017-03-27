let pug_plugin_ng = require('pug-plugin-ng');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var pug = require('gulp-pug');
var gulp_watch_pug = require('gulp-watch-pug');

let pug_opts = { doctype: 'html', plugins: [pug_plugin_ng], pretty: true };
let toSrc = gulp.dest((file) => file.base);

gulp.task('default', () => {
  gulp.src('src/**/*.pug')
      .pipe(plumber())
      .pipe(watch('src/**/*.pug'))
      // .pipe(gulp_watch_pug('src/**/*.pug', { delay: 100 }))
      .pipe(pug(pug_opts))
      .on('error', gutil.log)
      .on('data', () => gutil.log(gutil.colors.green('Compiled successfuly!')))
      .pipe(toSrc);
});
