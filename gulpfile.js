var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        notify: false
    });
});

gulp.task('css', function () {
    return gulp.src('./styles/**/*.css')
        .pipe(browserSync.stream());
});

gulp.task('serve', ['browser-sync'], function() {
    gulp.watch('./**/*.html', browserSync.reload);
    gulp.watch('./scripts/**/*.js', browserSync.reload);
    gulp.watch('./styles/**/*.css', ['css']);
});