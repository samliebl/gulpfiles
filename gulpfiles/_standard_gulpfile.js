var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var markdown = require('gulp-markdown');

gulp.task('sass', function () {
	return gulp.src('./src/sass/style.scss')
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
		}))
	.pipe(cleanCSS({
		compatibility: 'ie8'
		}))
	.pipe(rename({
		suffix: '.min'
		}))
	.pipe(gulp.dest('./dist/css'))
	})
  
gulp.task('js', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
			}))
		.pipe(gulp.dest('./dist/js'))
	})
  
gulp.task('md', () =>
	gulp.src('./content/*.md')
		.pipe(markdown())
		.pipe(rename({
			extname: '.html'
			}))
		.pipe(gulp.dest('./src'))
);

gulp.task('html', function() {
  return gulp.src(['./src/index.html', './src/copy.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['css', 'js', 'md', 'html']);

gulp.task('watch', function() {
	gulp.watch('./src/**/*', ['default'])
});
