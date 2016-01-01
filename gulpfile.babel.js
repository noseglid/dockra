'use babel';

const gulp = require('gulp');
const del = require('del');
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

const cssFiles = [
  'src/**/*.scss',
  'node_modules/humane-js/themes/jackedup.css'
];

const javascriptFiles = [
  'src/**/*.js',
  'src/**/*.jsx'
];

const icuFiles = [
  'src/localization/strings/*.icu'
];

const htmlFiles = [
  'src/**/*.html'
];

const imageFiles = [
  'src/assets/images/*.png'
];

const fontFiles = [
  'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
  'node_modules/font-awesome/fonts/*'
];

gulp.task('css', () => {
  return gulp.src(cssFiles)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        'node_modules/bootstrap-sass/assets/stylesheets/',
        'node_modules/spinkit/scss/',
        'node_modules/vex-js/sass/',
        'node_modules/font-awesome/scss/'
      ]
    }).on('error', $.sass.logError))
    .pipe($.concat('main.css'))
    .pipe($.minifyCss())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('javascript', () => {
  return gulp.src(javascriptFiles)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', () => {
  return gulp.src(htmlFiles)
    .pipe(gulp.dest('dist/'));
});

gulp.task('images', () => {
  return gulp.src(imageFiles)
    .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('fonts', () => {
  return gulp.src(fontFiles)
    .pipe(gulp.dest('dist/assets/fonts/'));
});

gulp.task('icu', () => {
  return gulp.src(icuFiles)
    .pipe(gulp.dest('dist/localization/strings/'));
});

gulp.task('build', [ 'css', 'javascript', 'html', 'images', 'fonts', 'icu' ]);

gulp.task('clean', () => {
  return del('dist/');
});

gulp.task('watch', [ 'build' ], () => {
  gulp.watch(javascriptFiles, [ 'javascript' ]);
  gulp.watch(cssFiles, [ 'css' ]);
  gulp.watch(htmlFiles, [ 'html' ]);
});
