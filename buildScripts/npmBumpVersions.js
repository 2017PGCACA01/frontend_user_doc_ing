let gulp = require("gulp"),
  bump = require("gulp-bump"),
  args = require("yargs").argv,
  chalk = require("chalk"),
  packageJSON = ["./../package.json"];

let type;

if (!args.type || typeof args.type !== "string") {
  type = "patch";
} else {
  type = args.type;
}

// Defined method of updating:
// Semantic
gulp.task("default", () => {
  if (args.env === "prod") {
    gulp.src(packageJSON).pipe(bump({ type })).pipe(gulp.dest("./../"));
  } else {
    console.log(
      chalk.green("[INFO]: Version will not be updated for a non prod build")
    );
  }
});
