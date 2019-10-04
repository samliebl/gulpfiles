// Gulp dependencies
var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest,
    parallel = _require.parallel;
var combineDuplicatedSelectors = require('postcss-combine-duplicated-selectors')({
    removeDuplicatedProperties: true
});
var classNameShortener = require('postcss-class-name-shortener');
var shortFontSize = require('postcss-short-font-size');
var autoreset = require('postcss-autoreset');
var cssstats = require('postcss-cssstats');
var select = require('postcss-select');
var stylelint = require('stylelint');
var stylefmt = require('stylefmt');
var pathway = require('./lib/pathway');
var perfectionist = require('perfectionist')({
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
var autoprefixer = require('autoprefixer');
var hexToRgb = require('postcss-rgb-plz');
var pxtorem = require('postcss-pxtorem')({
    rootValue: 16,
    unitPrecision: 5,
    propList: ['*'],
    replace: true,
    mediaQuery: true,
    minPixelValue: 0
});
var sorting = require('postcss-sorting');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var csso = require('postcss-csso');
var cssnano = require('cssnano');
var sass = require('gulp-sass');
var path = require('path');
var fs = require('fs');

var plugins = [
    combineDuplicatedSelectors,
    shortFontSize,
    autoprefixer,
    hexToRgb,
    pxtorem,
    sorting,
    perfectionist
];

function css() {
    //if (!fs.existsSync('dist')) {
    //    fs.mkdirSync('dist');
    //}
    //if (!fs.existsSync('dist/css')) {
    //    fs.mkdirSync('dist/css');
    //}
    return src(pathway.src)
        .pipe(concat('main.css'))
        .pipe(postcss(plugins))
        .pipe(rename({
            basename: 'main'
        }))
        .pipe(dest(pathway.dist))
        .pipe(postcss([csso]))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(pathway.dist))
}

function sass() {
    return src('src/sass/export.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(rename({
            basename: 'main'
        }))
        .pipe(dest('dist/css'))
        .pipe(postcss([csso]))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('dist/css'));
}

// exports.js = js;
exports.css = css;
exports.sass = sass;
exports['default'] = parallel(css, sass);
