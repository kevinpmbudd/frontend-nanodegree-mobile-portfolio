var gulp = require('gulp'),
		uncss = require('gulp-uncss'),
		nano = require('gulp-cssnano'),
		psi = require('psi'),
		ngrok = require('ngrok'),
		critical = require('critical'),
		sequence = require('run-sequence'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
		browserSync = require('browser-sync').create(),
		reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    htmlreplace = require('gulp-html-replace');

var site = '';

gulp.task('js', function () {
   return gulp.src(['src/js/*.js', 'src/views/js/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/js/'));
});

gulp.task('image', function () {
    return gulp.src(['src/img/*', 'src/views/images/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('html-replace', function() {
  gulp.src('src/index.html')
    .pipe(htmlreplace({
        'css': 'styles.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/*.js").on("change", browserSync.reload);
    gulp.watch("src/*.css").on("change", browserSync.reload);
});

gulp.task('css', function () {
    return gulp.src(['src/css/*.css', 'src/views/css/*.css'])
        .pipe(uncss({
            html: ['src/index.html', 'src/views/pizza.html']
        }))
        .pipe(nano())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('critical', function (cb) {
  critical.generate({
    base: './',
    src: 'index.html',
    css: ['uncss/print.css', 'uncss/style.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: 'css/critical.css',
    minify: true,
    extract: false,
    ignore: ['font-face']
  });
});

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(8080, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-desktop', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'desktop'
  }, cb);
});

gulp.task('psi-mobile', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'mobile'
  }, cb);
});

gulp.task('psi-seq', function (cb) {
  return sequence(
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

gulp.task('psi', ['psi-seq'], function() {
  console.log('Woohoo! Check out your page speed scores!')
  process.exit();
})