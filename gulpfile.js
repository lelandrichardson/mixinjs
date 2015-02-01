var gulp = require('gulp');
var browserify = require('browserify');
var mocha = require('gulp-mocha');
var source = require('vinyl-source-stream');

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

gulp.task('test', function () {
    return gulp.src('tests/mixin.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('test-watch', function () {
    gulp.watch('src/*.js', ['test']);
    gulp.watch('tests/*.js', ['test']);
});

gulp.task('build', function () {
    browserify('./index.js', { debug: false, standalone: "mixin" })
        .transform({ sourcemap: false }, 'uglifyify')
        .bundle()
        .pipe(source('mixin.min.js'))
        .pipe(gulp.dest('build'))
});