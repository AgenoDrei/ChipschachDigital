const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const del = require('del');
const ts = require('gulp-typescript');
// const sourcemaps = require('gulp-sourcemaps');       // TODO: make sourcemaps work


gulp.task('clean', function () {
    return del('frontend/build');
});

gulp.task('copy:assets', ['clean'], function() {
    return gulp.src([
        'frontend/**/*',
        '!frontend/**/*.ts'
        // '!frontend/build/**/*'
    ], { base : './frontend' })
        .pipe(gulp.dest('frontend/build'))
});

gulp.task('compileTS', ['clean'], function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('frontend/build/app'));
});

gulp.task('build', ['compileTS', 'copy:assets']);

gulp.task('nodemon', function(cb){
    var started = false;

    return nodemon({
        script: 'bin/www'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watchFrontend', function(){
    gulp.watch('frontend/app/**/*', function() { gulp.start('build'); });
    gulp.watch('frontend/*.html', function() { gulp.start('build'); });
    gulp.watch('frontend/*.js', function() { gulp.start('build'); });
});

gulp.task('default', ['build', 'watchFrontend', 'nodemon']);