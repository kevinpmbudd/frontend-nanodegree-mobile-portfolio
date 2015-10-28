var gulp = require('gulp'),
		uncss = require('gulp-uncss'),
		nano = require('gulp-cssnano'),
		psi = require('psi'),
		ngrok = require('ngrok'),
		critical = require('critical'),
		sequence = require('run-sequence'),
		browserSync = require('browser-sync').create();
		reload = browserSync.reload;

var site = '';

// Watch scss AND html files, doing different things with each.
gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("*.js").on("change", browserSync.reload);
    gulp.watch("*.css").on("change", browserSync.reload);
});

gulp.task('css', function () {
    return gulp.src('css/*.css')
        .pipe(uncss({
            html: ['index.html', 'views/*.html']
        }))
        .pipe(nano())
        .pipe(gulp.dest('./uncss'));
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