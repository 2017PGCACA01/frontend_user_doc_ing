let fs = require("fs"),
  aws = JSON.parse(fs.readFileSync("../config.json")),
  args = require("yargs").argv,
  gulp = require("gulp"),
  chalk = require("chalk"),
  awspublish = require("gulp-awspublish");

let env;

if (!args.env || typeof args.env !== "string") {
  env = "dev";
} else {
  env = args.env;
}

let publisher = awspublish.create({
  params: {
    Bucket: aws[env]["bucket"],
    ACL: "public-read",
  },
  IAM: true,
});

let uploadtoS3 = function () {
  if (args.env !== "prod" || fs.readdirSync("./../dist/")[0] !== "assets") {
    return (
      gulp
        .src("./../dist/**")
        // gzip content.
        .pipe(awspublish.gzip({}))
        .pipe(publisher.publish())
        // eg: .pipe(publisher.sync("bar", [/^foo\/bar/, "baz.txt"]))
        // only directory bar will be synced
        // files in folder /foo/bar and file baz.txt will not be removed from the bucket despite not being in your local folder
        .pipe(publisher.sync())
        .pipe(awspublish.reporter())
    );
  } else {
    console.log(
      chalk.blue("[INFO]: Please build for prod before deploying it")
    );
  }
};

gulp.task("default", function () {
  uploadtoS3();
});
