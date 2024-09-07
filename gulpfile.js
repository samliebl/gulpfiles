import pkg from 'gulp';
const { src, dest, watch, series } = pkg;

import gulpLoadPlugins from 'gulp-load-plugins';
const plugins = gulpLoadPlugins();

import gulpRead from 'gulp-read';
import gulpHeader from 'gulp-header';
import gulpCsv2json from 'gulp-csv2json';
import gulpRename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import * as sass from 'sass'; // Importing `sass` in ESM format

// =============================================================================

// Today's date for any timestamps
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

const date = `${yyyy}-${mm}-${dd}`;

const compileSass = gulpSass(sass);

const paths = {
  scss: 'src/sass/**/*.scss',
  cssDest: 'dist/css',
};

// Task to compile SCSS to regular CSS
export function compileScss() {
  return src(paths.scss)
    .pipe(compileSass().on('error', compileSass.logError))
    .pipe(rename({ basename: 'style' })) // Ensure output filename is style.css
    .pipe(dest(paths.cssDest)); // Write the compiled CSS to dist/css
}

// Task to compile SCSS to minified CSS with .min appended before the file extension
export function minifyCss() {
  return src(paths.scss)
    .pipe(compileSass().on('error', compileSass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ basename: 'style', suffix: '.min' })) // Ensure minified file is style.min.css
    .pipe(dest(paths.cssDest)); // Write the minified CSS to dist/css
}

// Watch SCSS files and run the tasks automatically on change
export function watchFiles() {
  watch(paths.scss, series(compileScss, minifyCss));
}

// Default task
export default series(compileScss, minifyCss, watchFiles);
