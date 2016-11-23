'use strict';

var gulp = require('gulp'),
    //cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
	uglify = require('gulp-uglify');

var path = {
    build: {
        js: 'dist/',
        css: 'dist/',
		img: 'dist/',
    },
    src: {
        js: 'src/js/*.js',
        less: 'src/less/wsm-favorites.less',
		img: 'src/img/**/*.*', 
    },
    watch: {
        js: 'src/js/*.js',
        less: 'src/less/*.less',
		img: 'src/img/**/*.*',
    }//,
    //clean: './src'
};

gulp.task('js:build:min', function() {
  gulp.src(path.src.js)
	.pipe(sourcemaps.init())
	.pipe(uglify())
    .pipe(concat('wsm.favorites.min.js'))
	.pipe(sourcemaps.write('../js'))
	.pipe(gulp.dest(path.build.js))
    .pipe(gulp.dest('build'));
    });

gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(concat('wsm.favorites.js'))
        .pipe(gulp.dest(path.build.js));
    });

gulp.task('less:build', function () {
    gulp.src(path.src.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
    });


gulp.task('build', [
    'js:build',
    'js:build:min',
    //'less:build',
    //'image:build'
    ]);


gulp.task('watch', function(){

    watch([path.watch.less], function(event, cb) {
        gulp.start('less:build');
        });

    /*watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });*/

});

gulp.task('default', ['build', 'watch']);