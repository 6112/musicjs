const gulp = require("gulp")
const ts = require("gulp-typescript")
const typedoc = require("gulp-typedoc")
const del = require("del")

const tsProject = ts.createProject("tsconfig.json")
const understandTsProject = ts.createProject("tsconfig.understand.json")

gulp.task("default", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"))
})

gulp.task("understand", () => {
  return understandTsProject.src()
    .pipe(understandTsProject())
    .js.pipe(gulp.dest("understand"))
})

gulp.task("doc", () => {
  return gulp.src("src/**/*.ts")
    .pipe(typedoc({
      module: "amd",
      target: "es2017",
      noImplicitAny: true,
      allowJs: true,
      out: "./doc",
    }))
})

gulp.task("clean", () => {
  return del([
    "./dist",
    "./doc",
    "./understand",
  ])
})
