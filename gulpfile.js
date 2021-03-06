const gulp = require('gulp');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const runSequence = require('run-sequence');

gulp.task('create-data-directory', function() {
  exec('mkdir -p data');
});

gulp.task('create-config-file', function() {
  exec('touch config.js');
});

gulp.task('start-mongo', function() {
  exec('mongod --fork --syslog --dbpath=data --smallfiles');
});

gulp.task('stop-mongo', function() {
  exec('killall mongod');
});

gulp.task('start-tests', () =>
  gulp.src('./test/*', {
    read: false
  })
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha())
  .once('error', () => {
    runSequence('stop-mongo');
  })
  .once('end', () => {
    runSequence('stop-mongo', 'quit');
  })
);

gulp.task('quit', function() {
  process.exit();
});

gulp.task('default', function() {
  runSequence('create-data-directory', 'create-config-file', 'start-mongo', 'start-tests', 'stop-mongo', 'quit');
});