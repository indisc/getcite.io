var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    cssmin       = require('gulp-cssmin'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    addsrc       = require('gulp-add-src'),
    order        = require('gulp-order'),
    watch        = require('gulp-watch'),
    livereload   = require('gulp-livereload'),
    notify       = require('gulp-notify');
    connect      = require('gulp-connect');


gulp.task('sass', function() {
    gulp.src('./scss/style.scss')
        .pipe(sass({
            onError: function(err) {
                         return notify().write(err);
                     }
        }))
        .pipe(autoprefixer("last 2 version", "ie 9"))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('js', function() {
    gulp.src('./js/scripts.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(addsrc('./js/_libs/*.js'))
        .pipe(order([
                'js/_libs/jquery-2.1.3.js',
                'js/_libs/owl.carousel.js',
                'js/scripts.js'
            ], { base: './' }))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('connect', function() {
    connect.server();
});


gulp.task('watch', function() {
    livereload.listen();

    gulp.watch('./scss/**/*.scss', ['sass']).on('change', livereload.changed);
    gulp.watch('./js/**/*.js', ['js']).on('change', livereload.changed);
    gulp.watch('./**/*.php').on('change', livereload.changed);
});


gulp.task('server', ['connect', 'watch']);
gulp.task('build', ['sass', 'js']);
