const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const del = require('del');
const ts = require('gulp-typescript');
// const sourcemaps = require('gulp-sourcemaps');       // TODO: make sourcemaps work


gulp.task('clean', function (cb) {
    del('frontend/build')
    return cb();
});

gulp.task('copy:assets', function() {
    return gulp.src([
        'frontend/**/*',
        '!frontend/**/*.ts'
        // '!frontend/build/**/*'
    ], { base : './frontend' })
        .pipe(gulp.dest('frontend/build'))
});

gulp.task('compileTS', function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('frontend/build/app'));
});

gulp.task('build', ['clean', 'compileTS', 'copy:assets'], function(cb) {
    cb();
});

gulp.task('nodemon', ['watchFrontend'], function(cb){
    var started = false;

    return nodemon({
        script: 'bin/www',
        ignore: 'frontend'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watchFrontend', ['build'], function(cb){
    gulp.watch('frontend/app/**/*', function() { gulp.start('compileTS'); });
    gulp.watch('frontend/*.html', function() { gulp.start('copy:assets'); });
    gulp.watch('frontend/*.js', function() { gulp.start('copy:assets'); });
    cb();
});

gulp.task('default', ['build', 'watchFrontend', 'nodemon']);