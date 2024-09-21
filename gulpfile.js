import pkg from 'gulp';
const { src, dest, watch, series } = pkg;

import nunjucksRender from 'gulp-nunjucks-render';
import gulpCsv2json from 'gulp-csv2json';
import cleanCSS from 'gulp-clean-css';
import gulpHeader from 'gulp-header';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import svgo from 'gulp-svgo';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as sass from 'sass'; // Importing `sass` in ESM format

import { data } from './data/index.js';

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
    cssdest: 'dist/css',
    tmpl: 'src/tmpl/**/*.njk',
    tmpldest: 'dist/',
    imgdest: 'dist/img/',
    img: 'src/img',
    svg: 'src/img/svg/*.svg'
};

// Task to compile SCSS to regular CSS
export function compileScss() {
    return src(paths.scss)
        .pipe(compileSass().on('error', compileSass.logError))
        // Ensure output filename is main.css
        .pipe(rename({ basename: 'main' })) 
        // Write the compiled CSS to dist/css
        .pipe(dest(paths.cssdest)); 
}

// Task to compile SCSS to minified CSS with .min appended before the file 
// extension
export function minifyCss() {
    return src(paths.scss)
        .pipe(compileSass().on('error', compileSass.logError))
        .pipe(cleanCSS())
        // Ensure minified file is main.min.css
        .pipe(rename({ basename: 'main', suffix: '.min' }))
        // Write the minified CSS to dist/css
        .pipe(dest(paths.cssdest)); 
}

export function nunjucks() {
    return src(paths.tmpl)
        .pipe(plumber())
        .pipe(nunjucksRender({
            data: data,
            path: [
                'src/tmpl/'
            ]
        }))
        .pipe(htmlmin({ collapseWhitespace: false }))
        .pipe(dest(paths.tmpldest))
}

export function optimizeSvg() {
    return src(paths.svg)
        .pipe(svgo())
        .pipe(dest(paths.imgdest))
}

// Watch SCSS files and run the tasks automatically on change
export function watchFiles() {
    watch([
        paths.scss,
        paths.tmpl
    ], series(compileScss, minifyCss, nunjucks));
}

// Default task
export default series(compileScss, minifyCss, nunjucks, watchFiles);