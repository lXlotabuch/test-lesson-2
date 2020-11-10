const gulp = require("gulp");
const bs = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const cleanFolder = require("gulp-clean");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const imageMin = require("gulp-imagemin");
const minifyJS = require("gulp-js-minify");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

gulp.task("cleanDist", () => {
  return gulp.src("./dist/*", { read: false }).pipe(cleanFolder());
});

gulp.task("scssBuild", () => {
  return gulp
    .src("./src/scss/index.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("jsBuild", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(minifyJS().on("error", console.error))
    .pipe(gulp.dest("./dist/script"));
});

gulp.task("imageBuild", () => {
  return gulp
    .src("./src/image/**/**")
    .pipe(
      imageMin([
        imageMin.gifsicle({ interlaced: true }),
        imageMin.mozjpeg({ quality: 75, progressive: true }),
        imageMin.optipng({ optimizationLevel: 5 }),
        imageMin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(gulp.dest("./dist/image/"));
});

gulp.task("htmlBuild", () => {
  return gulp.src("./src/html/*.html").pipe(gulp.dest("./dist/"));
});

gulp.task(
  "build",
  gulp.series("cleanDist", "scssBuild", "jsBuild", "imageBuild", "htmlBuild"),
);

// gulp.task("dev", () => {
//   gulp.watch("./src/scss/*", gulp.series("scssBuild")).on("change", bs.reload);
//   gulp.watch("./src/js/*", gulp.series("jsBuild")).on("change", bs.reload);
//   gulp.watch("index.html").on("change", bs.reload);
//   bs.init({
//     server: {
//       basedir: "./",
//     },
//   });
// });

gulp.task("dev", () => {
  gulp.watch("./src/scss/*", gulp.series("scssBuild")).on("change", bs.reload);
  gulp.watch("./src/js/*", gulp.series("jsBuild"));
  gulp.watch("./src/html/*", gulp.series("htmlBuild"));
});
