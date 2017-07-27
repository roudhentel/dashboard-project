var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass', function () {
    gulp.src('./public/styles/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/'));

    gulp.src('./public/contents/*/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./public/contents/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./public/styles/main.scss', ['sass']);
    gulp.watch('./public/contents/**/*.scss', ['sass']);
});