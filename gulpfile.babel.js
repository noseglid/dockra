'use babel';

import fs from 'fs';
import gulp from 'gulp';
import del from 'del';
import mkdirp from 'mkdirp';
import { exec } from 'child_process';
import gulpLoadPlugins from 'gulp-load-plugins';
import packager from 'electron-packager';

const $ = gulpLoadPlugins();

const cssFiles = [
  'src/**/*.scss',
  'node_modules/react-select/dist/react-select.css',
  'node_modules/rc-tooltip/assets/bootstrap.css',
  'node_modules/toastr/build/toastr.css'
];

const javascriptFiles = [
  'src/**/*.js',
  'src/**/*.jsx'
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

gulp.task('release:dependencies', [ 'release:package.json' ], () => {
  return new Promise((resolve, reject) => {
    $.util.log('Will install dependencies. This may take a while...');
    exec('npm install', { cwd: 'build/dist' }, (err, stdout, stderr) => {
      if (err) return reject(err);
      $.util.log('Dependencies successfully installed!');
      resolve();
    });
  });
});

gulp.task('release:package.json', () => {
  mkdirp.sync('build/dist');

  return new Promise((resolve, reject) => {
    const pkg = require('./package.json');
    fs.writeFileSync('build/dist/package.json', JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      dependencies: pkg.dependencies,
      main: pkg.main
    }));
    resolve();
  });
});

gulp.task('release:copy', [ 'build' ], () => {
  gulp.src([ 'dist/**/*' ])
    .pipe(gulp.dest('build/dist'));
});

gulp.task('release', [ 'release:copy', 'release:dependencies' ], (cb) => {
  const packageJson = require('./package.json');

  const opts = {
    arch: 'x64',
    dir: 'build/dist',
    platform: 'darwin',
    'app-bundle-id': packageJson.name,
    'app-category-type': 'public.app-category.developer-tools',
    'app-version': packageJson.version,
    asar: true,
    icon: './resources/osx/icon.icns',
    name: packageJson.name,
    out: 'build/release',
    prune: true,
    version: '0.36.7',
    overwrite: true
  };
  packager(opts, cb);
});

gulp.task('build', [ 'css', 'javascript', 'html', 'images', 'fonts' ]);

gulp.task('clean', () => {
  return del([ 'dist/', 'build/' ]);
});

gulp.task('watch', [ 'build' ], () => {
  gulp.watch(javascriptFiles, [ 'javascript' ]);
  gulp.watch(cssFiles, [ 'css' ]);
  gulp.watch(htmlFiles, [ 'html' ]);
});
