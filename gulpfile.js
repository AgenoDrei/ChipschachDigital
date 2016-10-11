const gulp = require('gulp');
const browserSync = require('browser-sync');
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

gulp.task('refresh', ['build'], browserSync.reload);

gulp.task('start', function(){
    browserSync.init({
        server: './',
        startPath: '/index.html'
    });
    gulp.watch('frontend/app/**/*', function() { gulp.start('refresh'); });     // TODO: make browser-sync work
    gulp.watch('frontend/*.html', function() { gulp.start('refresh'); });
    gulp.watch('frontend/*.js', function() { gulp.start('refresh'); });
});

gulp.task('default', ['build']);