const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const fileinclude = require("gulp-file-include");
const autoprefixer = require("gulp-autoprefixer");
const bs = require("browser-sync").create();
const rimraf = require("rimraf");
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");

// Paths
const path = {
  src: {
    html: "src/*.html",
    others: "src/*.+(php|ico|png)",
    htminc: "src/partials/**/*.htm",
    incdir: "src/partials/",
    vendor: "src/vendor/**/*.*",
    fonts: "src/fonts/**/*.*",
    js: "src/js/*.js",
    scss: "src/scss/**/*.scss",
    images: "src/images/**/*.+(png|jpg|gif|svg)",
    blur: "src/images/**/*.jpg",
  },
  build: {
    dir: "dist/",
  },
};

// Clean Distribution folder
const clean = (cb) => {
  rimraf("./dist", cb);
};

// Error Message
const customPlumber = (errTitle) => {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass",
    }),
  });
};

// HTML Task: Generate HTML files with partials
const html = () =>
  src(path.src.html)
    .pipe(customPlumber("Error Running html-include"))
    .pipe(
      fileinclude({
        basepath: path.src.incdir,
      })
    )
    .pipe(dest(path.build.dir))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

// SCSS Task: Generate Css files from .scss files
const scss = () =>
  src(path.src.scss)
    .pipe(customPlumber("Error Running Sass"))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("/maps"))
    .pipe(dest(path.build.dir + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

const scssDev = () =>
  src(path.src.scss)
    .pipe(customPlumber("Error Running Sass"))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(uglifycss({ maxLineLen: 80, uglyComments: true }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("/maps"))
    .pipe(dest(path.build.dir + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
// Javascript task: generate theme script files
const js = () =>
  src(path.src.js)
    .pipe(customPlumber("Error Running JS"))
    .pipe(uglify())
    .pipe(dest(path.build.dir + "js/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

// Assets Tasks: copy assets(images,vendor,fonts etc) from source to destination
const images = () =>
  src(path.src.images)
    .pipe(dest(path.build.dir + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

const vendor = () =>
  src(path.src.vendor)
    .pipe(dest(path.build.dir + "vendor/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

const fonts = () =>
  src(path.src.fonts)
    .pipe(dest(path.build.dir + "fonts/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

const others = () =>
  src(path.src.others)
    .pipe(dest(path.build.dir))
    .pipe(
      bs.reload({
        stream: true,
      })
    );

// Watch task
const watchTask = () => {
  watch([path.src.html, path.src.htminc], series(html));
  watch(path.src.scss, series(scss));
  watch(path.src.js, series(js));
  watch(path.src.images, series(images));
  watch(path.src.vendor, series(vendor));
  watch(path.src.fonts, series(fonts));
  watch(path.src.others, series(others));
};

exports.default = series(
  clean,
  html,
  parallel(scssDev, js),
  parallel(images, vendor, fonts, others)
);

exports.dev = series(
  html,
  parallel(scss, js),
  parallel(images, vendor, fonts, others),
  parallel(watchTask, function () {
    bs.init({
      server: {
        baseDir: path.build.dir,
      },
      port: 3050,
    });
  })
);
