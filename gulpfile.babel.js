'use strict'

const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const del = require('del')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babelify = require('babelify')
const browserSync = require('browser-sync')

const reload = browserSync.reload
const loader = gulpLoadPlugins()

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
]

// 编译 Less，添加浏览器前缀
gulp.task('styles', () => {
  return gulp.src([ 'app/view/style/**/*.less' ])
    .pipe(loader.changed('styles', { extension: '.less' }))
    .pipe(loader.plumber({
      errorHandler: err => {
        console.error(err)
        this.emit('end')
      },
    }))
    .pipe(loader.less())
    .pipe(loader.postcss([ autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }) ]))
    .pipe(gulp.dest('app/public/stylesheets'))
    .pipe(loader.postcss([ cssnano() ]))
    .pipe(loader.rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/public/stylesheets'))
    .pipe(loader.size({ title: 'styles' }))
})

const bundle = b => {
  return b.bundle()
    .on('error', loader.util.log.bind(loader.util, 'Browserify Error'))
    .pipe(source('todo.js'))
    .pipe(buffer())
    .pipe(gulp.dest('app/public/javascripts'))
    .pipe(loader.uglify())
    .pipe(loader.rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/public/javascripts'))
    .pipe(loader.size({ title: 'scripts' }))
}

// 打包 + babel 编译
gulp.task('browserify', () => {
  const b = watchify(browserify({
    entries: 'app/view/script/todo.js',
    basedir: __dirname,
    cache: {},
    packageCache: {},
  }))

  b.transform(babelify.configure({
    presets: [ 'es2015' ],
  }))

  b.on('update', () => {
    bundle(b)
    setTimeout(() => {
      reload()
    }, 1000)
  })
    .on('log', loader.util.log)

  bundle(b)
})

// 洗刷刷
gulp.task('clean', () => {
  return del([ 'app/public/javascripts/*', 'app/public/stylesheets/*' ], { dot: true })
})

// 监视源文件变化自动cd编译
gulp.task('watch', () => {
  gulp.watch('app/view/style/**/*less', [ 'styles' ])
})

// 清空 gulp-cache 缓存
gulp.task('clearCache', cb => {
  return loader.cache.clearAll(cb)
})

// refresh web page (browser)
gulp.task('serve', [ 'default' ], () => {
  browserSync({
    // TODO: based on local server
    proxy: '127.0.0.1:7001',
    port: '3000',
  })
  gulp.watch([
    'app/public/stylesheets/*',
    'app/view/*',
  ], reload)
})

gulp.task('build', () => {
  runSequence('clean',
    [ 'styles', 'browserify' ])
})

// 默认任务
gulp.task('default', cb => {
  runSequence('clean',
    [ 'styles', 'browserify' ], 'watch', cb)
})
