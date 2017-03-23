let pug_plugin_ng = require('pug-plugin-ng');
var gulp = require('gulp');
var watch = require('gulp-watch');
var pug = require('gulp-pug');
var gulp_watch_pug = require('gulp-watch-pug');

let pug_opts = { doctype: 'html', plugins: [pug_plugin_ng], pretty: true };
let toSrc = gulp.dest((file) => file.base);

gulp.task('default', () => {
  gulp.src('src/**/*.pug')
      .pipe(watch('src/**/*.pug'))
      .pipe(gulp_watch_pug('src/**/*.pug', { delay: 100 }))
      .pipe(pug(pug_opts))
      .pipe(toSrc);
});
