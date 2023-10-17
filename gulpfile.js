const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const gulpif = require('gulp-if');
const gulpSass = require('gulp-sass');
const webpackStream = require('webpack-stream');
const sass = require('sass');
const mainSass = gulpSass(sass);
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

let prod = false;

const isProd = (done) => {
  prod = true;
  done();
}

const clean = () => {
  return del(['dist'])
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/styles/**/*.scss')
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(concat('main.css'))
    .pipe(mainSass())
    .pipe(autoprefixes({
      cascade: false
    }))
    .pipe(gulpif(prod, cleanCSS({
      level: 2
    })))
    .pipe(gulpif(!prod, sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpif(prod, htmlMin({
      collapseWhitespace: true
    })))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const svgSprites = () => {
  return src('src/images/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/images'))
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/*.svg',
    'src/images/**/*.jpeg'
  ])
    .pipe(gulpif(prod, image()))
    .pipe(dest('dist/images'))
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'app.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(gulpif(prod, uglify().on('error', notify.onError())))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

watch('src/**/*.html', htmlMinify);
watch('src/styles/**/*.scss', styles);
watch('src/images/**/*.svg', svgSprites);
watch('./src/img/*.{jpg,jpeg,png,svg}', images);
watch('./src/img/**/*.{jpg,jpeg,png}', images);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);

exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.dev = series(clean, resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles)
exports.build = series(isProd, clean, resources, htmlMinify, scripts, styles, images, svgSprites)
