var gulp = require("gulp");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");

var filesToLint = [
	"app/**/*.js",

	// Exclude libraries, node modules, and NativeScript modules from linting
	"!app/lib/**/*.js",
	"!app/node_modules/**/*.js",
	"!app/tns_modules/**/*.js"
];

gulp.task("jscs", function() {
	gulp.src(filesToLint)
		.pipe(jscs());
});

gulp.task("jshint", function() {
	return gulp.src(filesToLint)
		.pipe(jshint())
		.pipe(jshint.reporter());
});

gulp.task("lint", ["jshint", "jscs"]);