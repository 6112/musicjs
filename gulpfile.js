const gulp = require("gulp")
const ts = require("gulp-typescript")
const typedoc = require("gulp-typedoc")
const del = require("del")

const browserTsProject = ts.createProject("tsconfig/browser.json")
const understandTsProject = ts.createProject("tsconfig/understand.json")

gulp.task("default", () => {
  return browserTsProject.src()
    .pipe(browserTsProject())
    .js.pipe(gulp.dest("./dist/browser"))
})

gulp.task("understand", () => {
  return understandTsProject.src()
    .pipe(understandTsProject())
    .js.pipe(gulp.dest("./dist/understand"))
})

gulp.task("doc", () => {
  return gulp.src("src/**/*.ts")
    .pipe(typedoc({
      module: "amd",
      target: "es2017",
      noImplicitAny: true,
      allowJs: true,
      out: "./dist/doc",
    }))
})

gulp.task("clean", () => {
  return del([
    "./dist",
  ])
})
