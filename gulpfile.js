//==============//
// DEPENDENCIES //
//==============//

// Local dependencies.
var pkg = require('./package.json');

// Node dependencies.
var fs = require('fs');

// Third-party dependencies.
var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var header = require('gulp-header');
var runSequence = require('run-sequence');
var KarmaServer = require('karma').Server;
var serverFactory = require('spa-server');
var deploy = require('gulp-gh-pages');
var ncp = require('ncp').ncp;

const SCRIPT_PATH = './src/scripts/module.js';
const DEPLOY_TEMP_PATH = './.deploy';
const DEMO_PATH = './demo';


//=========//
// GLOBALS //
//=========//


//=======//
// CLEAN //
//=======//

gulp.task('clean', function () {
  return del('dist');
});


//=======//
// BUILD //
//=======//

gulp.task('build', function (done) {
  runSequence('clean', 'build:scripts', done);
});


gulp.task('build:scripts', function () {
  var headerContent = fs.readFileSync('src/scripts/header.js', 'utf8');

  return gulp
    .src(SCRIPT_PATH)
    .pipe(concat('betsol-ng-intl-tel-input.js'))
    .pipe(ngAnnotate({
      'single_quotes': true
    }))
    .pipe(header(headerContent, { pkg : pkg } ))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(uglify())
    .pipe(header(headerContent, { pkg : pkg } ))
    .pipe(rename('betsol-ng-intl-tel-input.min.js'))
    .pipe(gulp.dest('dist/scripts'))
    .on('error', gutil.log)
  ;
});

gulp.task('build:scripts:watch', function () {
  gulp.watch(SCRIPT_PATH, ['build:scripts']);
});

gulp.task('watch', ['build:scripts:watch']);

gulp.task('start', ['demo:server', 'watch']);


//======//
// TEST //
//======//

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});


//======//
// DEMO //
//======//

gulp.task('demo:server', function () {
  var server = serverFactory.create({
    path: './demo',
    port: 1337
  });
  server.start();
});

gulp.task('demo:deploy', function (done) {
  runSequence(
    'demo:deploy:before',
    'demo:deploy:actual',
    'demo:deploy:after',
    done
  );
});

gulp.task('demo:deploy:actual', function () {
  console.log('Starting to deploy files...');
  return gulp.src(DEPLOY_TEMP_PATH + '/**/*')
    .pipe(deploy())
  ;
});

gulp.task('demo:deploy:before', function (done) {

  // Clearing temp directories and making a temp copy.
  deployClearTemp()
    .then(function () {
        makeTempCopy(done);
    })
  ;


  /**
   * Makes a temporary copy of the demos directory with symlinks resolved.
   *
   * @param {function} callback
   */
  function makeTempCopy (callback) {
    ncp(DEMO_PATH, DEPLOY_TEMP_PATH, {
      dereference: true
    }, function (error) {
      if (error) {
        return console.error(error);
      }
      console.log('Temporary copy created!');
      callback();
    });
  }

});

gulp.task('demo:deploy:after', function () {
  return deployClearTemp();
});


//==============//
// DEFAULT TASK //
//==============//

gulp.task('default', function (done) {
  runSequence('build', done);
});


/**
 * Clears temp directory.
 */
function deployClearTemp () {
  return del([DEPLOY_TEMP_PATH, './.publish']);
}
