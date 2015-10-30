var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
		browserSync = require('browser-sync').create(),
		reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    usemin = require('gulp-usemin'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev');

gulp.task('usemin-index', function() {
  return gulp.src('src/index.html')
    .pipe(usemin({
      css: [ minifyCss(), rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('usemin-pizza', function() {
  return gulp.src('src/views/*.html')
    .pipe(usemin({
      css: [ minifyCss(), rev() ],
      html: [ minifyHtml({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('dist/views/'));
});

gulp.task('image', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
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