"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var jsImport = require("gulp-js-import");
var gutil = require("gulp-util");
var jshint = require("gulp-jshint");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var stylish = require("jshint-stylish");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var fileinclude = require("gulp-file-include");
var autoprefixer = require("gulp-autoprefixer");
var runSequence = require("run-sequence");
var zip = require("gulp-zip");
var bs = require("browser-sync").create();
var rimraf = require("rimraf");
var gm = require("gulp-gm");

var path = {
  src: {
    // source
    html: "src/*.html",
    others: "src/*.+(php|ico|png)",
    htminc: "src/partials/**/*.htm",
    incdir: "src/partials/",
    plugins: "src/plugins/**/*.*",
    fonts: "src/fonts/**/*.*",
    js: "src/js/*.js",
    scss: "src/scss/**/*.scss",
    images: "src/images/**/*.+(png|jpg|gif|svg)",
    blur: "src/images/**/*.jpg",
  },
  build: {
    // build
    dir: "dist/development/",
  },
};

var template = {
  version: {
    free: "free",
    premium: "premium",
  },
};

/* =====================================================
Development Builds
===================================================== */

// HTML
gulp.task("html:build", function () {
  return gulp
    .src(path.src.html)
    .pipe(customPlumber("Error Running html-include"))
    .pipe(
      fileinclude({
        basepath: path.src.incdir,
        context: {
          version: template.version.premium,
        },
      })
    )
    .pipe(gulp.dest(path.build.dir))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// SCSS
gulp.task("scss:build", function () {
  var ignoreNotification = false;
  return gulp
    .src(path.src.scss)
    .pipe(customPlumber("Error Running Sass"))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(path.build.dir + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Javascript
gulp.task("js:build", function () {
  return (
    gulp
      .src(path.src.js)
      .pipe(customPlumber("Error Running JS"))
      .pipe(jsImport({ hideConsole: true }))
      // .pipe(jshint('./.jshintrc'))
      // .pipe(notify(function (file) {
      //   if (!file.jshint.success) {
      //     return file.relative + " (" + file.jshint.results.length + " errors)\n";
      //   }
      // }))
      // .pipe(jshint.reporter('jshint-stylish'))
      // .on('error', gutil.log)
      .pipe(gulp.dest(path.build.dir + "js/"))
      .pipe(
        bs.reload({
          stream: true,
        })
      )
  );
});

// Images
gulp.task("images:build", function () {
  return gulp
    .src(path.src.images)
    .pipe(gulp.dest(path.build.dir + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Make Zip
gulp.task("zip", function () {
  return gulp
    .src("dist/development/**/*")
    .pipe(zip("theme-files.zip"))
    .pipe(gulp.dest("dist/development"));
});

//Plugins
gulp.task("plugins:build", function () {
  return gulp
    .src(path.src.plugins)
    .pipe(gulp.dest(path.build.dir + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Fonts
gulp.task("fonts:build", function () {
  return gulp
    .src(path.src.fonts)
    .pipe(gulp.dest(path.build.dir + "fonts/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Other files like favicon, php, apple-icon on root directory
gulp.task("others:build", function () {
  return gulp.src(path.src.others).pipe(gulp.dest(path.build.dir));
});

// Error Message Show
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass",
    }),
  });
}

// Clean Build Folder
gulp.task("clean", function (cb) {
  rimraf("./dist", cb);
});

// Watch Task
gulp.task("watch:build", function () {
  gulp.watch(path.src.html, ["html:build"]);
  gulp.watch(path.src.htminc, ["html:build"]);
  gulp.watch(path.src.scss, ["scss:build"]);
  gulp.watch(path.src.js, ["js:build"]);
  gulp.watch(path.src.images, ["images:build"]);
  gulp.watch(path.src.plugins, ["plugins:build"]);
  gulp.watch(path.src.fonts, ["fonts:build"]);
});

// Build Task
gulp.task("build", function () {
  runSequence(
    // "clean",
    "html:build",
    "js:build",
    "scss:build",
    "images:build",
    "plugins:build",
    "fonts:build",
    "others:build",
    "watch:build",
    function () {
      bs.init({
        server: {
          baseDir: path.build.dir,
        },
        port: 3050,
      });
    }
  );
});

gulp.task("build-prod", function () {
  runSequence(
    // "clean",
    "html:build",
    "js:build",
    "scss:build",
    "images:build",
    "plugins:build",
    "fonts:build",
    "others:build",
    "zip"
  );
});

gulp.task("default", ["build"]);