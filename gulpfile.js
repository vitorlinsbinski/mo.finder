const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify')

function compileSass() {
    return gulp.src('./scss/*.scss') 
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
};

gulp.task('sass', compileSass);

function pluginsCSS() {
    return gulp.src('./css/lib/*.css')
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
}

gulp.task('plugincss', pluginsCSS);

function gulpJS() {
    return gulp.src('./js/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        })) 
        .pipe(uglify())
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
}

gulp.task('alljs', gulpJS);

function pluginJS() {
    return gulp
        .src(['./js/lib/aos.min.js', './js/lib/swiper.min.js'])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(browserSync.stream());
}

gulp.task('pluginjs', pluginJS);

function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
};

gulp.task('browser-sync', browser);

function watch() {
    gulp.watch('./scss/*.scss', compileSass);

    gulp.watch('./css/lib/*.css', pluginsCSS);

    gulp.watch('./*.html').on('change', browserSync.reload);

    gulp.watch('./js/scripts/*.js', gulpJS);

    gulp.watch('./js/lib/*.js', pluginJS);
};

gulp.task('watch', watch);

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugincss', 'alljs', 'pluginjs'));