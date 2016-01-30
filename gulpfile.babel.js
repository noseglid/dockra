'use babel';

import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import { exec } from 'child_process';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

const cssFiles = [
  'src/**/*.scss',
  'node_modules/humane-js/themes/jackedup.css',
  'node_modules/react-select/dist/react-select.css',
  'node_modules/rc-tooltip/assets/bootstrap.css'
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
    exec('npm install', { cwd: '.release' }, (err, stdout, stderr) => {
      if (err) return reject(err);
      $.util.log('Dependencies successfully installed!');
      resolve();
    });
  });
});

gulp.task('release:package.json', () => {
  try { fs.mkdirSync('.release/'); } catch (e) { /* noop */ }

  return new Promise((resolve, reject) => {
    const pkg = require('./package.json');
    fs.writeFileSync('.release/package.json', JSON.stringify({
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
    .pipe(gulp.dest('.release/'));
});

gulp.task('release:osx', [ 'release:copy', 'release:dependencies' ], () => {
  const packageJson = require('./package.json');
  return gulp.src('')
    .pipe($.electron({
      src: './.release',
      packageJson: packageJson,
      release: './release',
      cache: './cache',
      version: 'v0.35.5',
      platforms: [ 'darwin-x64' ],
      asar: true,
      platformResources: {
        darwin: {
          CFBundleDisplayName: packageJson.name,
          CFBundleIdentifier: packageJson.name,
          CFBundleName: packageJson.name,
          CFBundleVersion: packageJson.version,
          icon: './resources/osx/icon.icns'
        }
      }
    }))
    .pipe(gulp.dest(''));
});

gulp.task('build', [ 'css', 'javascript', 'html', 'images', 'fonts' ]);

gulp.task('release', [ 'release:osx' ]);

gulp.task('clean', () => {
  return del([ 'dist/', 'release/', '.release/' ]);
});

gulp.task('watch', [ 'build' ], () => {
  gulp.watch(javascriptFiles, [ 'javascript' ]);
  gulp.watch(cssFiles, [ 'css' ]);
  gulp.watch(htmlFiles, [ 'html' ]);
});
