var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var data = require('gulp-data');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var nunjucksRender = require('gulp-nunjucks-render');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var tmplPath = {
    path: ['./src/templates']
};
var imgPath = './src/img/**/*.{jpg,gif,png,jpeg,tiff,svg}';
var dataPath = './data/data.json';
var pgPath = './src/pages/**/*.{html,njk,nunj,nunjucks}';
var sassPath = './src/sass/style.scss';
var jsPath = [
    './src/js/**/jquery-3.3.1.min.js',
    './src/js/**/modernizr-3.3.0.min.js',
    './src/js/plugins.js',
    './src/js/main.js'
];
var min = {
    suffix: '.min'
}
var jsO = './dist/js';
var cssO = './dist/css';
var njkO = './dist';
var jsO = './dist/js';
var imgO = './dist/assets/img';
var nml = [
    'css',
    'img',
    'js',
    'njk'
];
var img0 = './dist/assets/img';

gulp.task('css', function() {
    return gulp.src(sassPath)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename(min))
        .pipe(gulp.dest(cssO))
});
gulp.task('img', function() {
    return gulp.src(imgPath)
        .pipe(imagemin())
        .pipe(gulp.dest(imgO))
});

gulp.task('js', function() {
    return gulp.src(jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename(min))
        .pipe(gulp.dest(jsO))
});

gulp.task('njk', function() {
    return gulp.src(pgPath)
        .pipe(data(function() {
            return require(dataPath)
        }))
        .pipe(nunjucksRender(tmplPath))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(njkO))
});
gulp.task('default', ['css', 'js', 'njk']);
gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['css', 'njk'])
})