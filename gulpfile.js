const gulp = require('gulp');
const $ = require('gulp-terser');
const ts = require('gulp-typescript');
const _ = ts.createProject("tsconfig.json")
gulp.task('build', () =>
  _.src().pipe(_()).js
  .pipe($({
    ecma:2020,
    mangle: {
      eval: false,
      keep_fnames: true,
      toplevel: true,
      keep_classnames:true,
      properties: false
    },compress:{
      properties:false,
      toplevel: true,
      keep_classnames:true,
      keep_fnames:false,
      inline:true,
      drop_console:true
    }
  }))
  .pipe(gulp.dest('dist'))
);