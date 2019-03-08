var gulp = require('gulp');
var del = require('del');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var html2js = require('gulp-html2js');
var less = require('gulp-less');
var htmlmin = require('gulp-htmlmin');
var publish = require('gulp-publish');

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('publish', function() {
  gulp.src('*.html')
    .pipe(publish({
      enableResolve: true,
      postfix: 'md5',
      js: [[uglify, {}]],
      css: [[cssmin, {keepSpecialComments: 0}]],
      less: [
        [less, {}],
        [autoprefixer, {
          browsers: [
            'Explorer >= 9',
            'Chrome >= 26',
            'Firefox >= 26',
            'Safari >= 6'
          ],
          cascade: true
        }],
        [cssmin, {
          keepSpecialComments: 0
        }]
      ]
    }))
    .pipe(htmlmin({
      removeComment: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jshint', function() {
  gulp.src([
    'media/js/**/*.js',
    'tests/**/*.spec.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('csslint', function() {
  gulp.src(['./styles/*.*'])
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('favicon', function() {
  gulp.src('favicon.ico')
    .pipe(gulp.dest('./build/'));
});

gulp.task('images', function() {
  gulp.src(['./media/img/*.*', './media/img/**/*'])
    //.pipe(imagemin({
    //  progressive: true,
    //  optimizationLevel: 4
    //}))
    .pipe(gulp.dest('./build/media/img/'))
});

gulp.task('fonts', function() {
  gulp.src(['./media/fonts/**/*'])
    .pipe(gulp.dest('./build/media/fonts'));
});

gulp.task('js', function() {
  gulp.src(['./media/js/*'])
    .pipe(gulp.dest('./build/media/js'));
});

gulp.task('html2template', function() {
  gulp.src('./media/views/*.html')
    .pipe(html2js('angular.js', {
      adapter: 'angular',
      useStrict: true
    }))
    .pipe(concat('template.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/media/scripts/'));
});

gulp.task('build', ['favicon', 'images', 'fonts', 'js', 'publish', 'html2template']);
