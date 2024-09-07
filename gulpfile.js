// Gulp dependencies
import { src, dest, parallel } from 'gulp';
import combineDuplicatedSelectors from 'postcss-combine-duplicated-selectors';
import classNameShortener from 'postcss-class-name-shortener';
import shortFontSize from 'postcss-short-font-size';
import autoreset from 'postcss-autoreset';
import cssstats from 'postcss-cssstats';
import select from 'postcss-select';
import stylelint from 'stylelint';
import stylefmt from 'stylefmt';
import pathway from './lib/pathway.js';
import perfectionist from 'perfectionist';
import autoprefixer from 'autoprefixer';
import hexToRgb from 'postcss-rgb-plz';
import pxtorem from 'postcss-pxtorem';
import sorting from 'postcss-sorting';
import postcss from 'gulp-postcss';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import cssnano from 'cssnano';
import gulpSass from 'gulp-sass';
import path from 'path';
import fs from 'fs';

// PostCSS plugins configuration
const combineSelectors = combineDuplicatedSelectors({
    removeDuplicatedProperties: true
});

const perfectionistOptions = perfectionist({
    trimLeadingZero: false,
    colorShorthand: false,
    colorCase: 'lower',
    format: 'expanded',
    indentSize: 4,
    indentChar: ' ',
    maxAtRuleLength: 80,
    maxSelectorLength: 80,
    maxValueLength: 80,
    trimTrailingZeros: false,
    cascade: true,
    zeroLengthNoUnit: true
});

const pxtoremOptions = pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ['*'],
    replace: true,
    mediaQuery: true,
    minPixelValue: 0
});

// Array of PostCSS plugins
const plugins = [
    combineSelectors,
    shortFontSize,
    autoprefixer,
    hexToRgb,
    pxtoremOptions,
    sorting,
    perfectionistOptions
];

// Task to handle CSS files with PostCSS and other plugins
export function css() {
    return src(pathway.src)
        .pipe(concat('main.css'))
        .pipe(postcss(plugins))
        .pipe(rename({ basename: 'main' }))
        .pipe(dest(pathway.dist))
        .pipe(postcss([csso]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(pathway.dist));
}

// Task to handle SCSS files, compile to CSS and run PostCSS plugins
export function sassTask() {
    return src('src/sass/export.scss')
        .pipe(gulpSass())
        .pipe(postcss(plugins))
        .pipe(rename({ basename: 'main' }))
        .pipe(dest('dist/css'))
        .pipe(postcss([csso]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'));
}

// Default task running both CSS and Sass tasks in parallel
export default parallel(css, sassTask);
