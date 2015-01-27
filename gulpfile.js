var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');

function swallowError ( error ) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('default', function () {
    browserify('./index.js', { debug: true })
        .bundle()
        .on('error', swallowError)
        .pipe(gulp.dest('build/mixin.js'))
});
