import {task} from 'gulp';
import {join} from 'path';
import {statSync} from 'fs';
import {DIST_ROOT} from '../constants';
import {spawnSync} from 'child_process';
import {isTravisMasterBuild} from '../util/travis-ci';
import {openFirebaseDashboardDatabase} from '../util/firebase';

const bundlesDir = join(DIST_ROOT, 'bundles');

/** Task which runs test against the size of ngxfileuploader. */
task('payload', ['ngxfileuploader:clean-build'], () => {

  const results = {
    timestamp: Date.now(),
    // ngxfileuploader bundles
    ngxfileuploader_umd: getBundleSize('ngxfileuploader.umd.js'),
    ngxfileuploader_umd_minified_uglify: getBundleSize('ngxfileuploader.umd.min.js'),
    ngxfileuploader_fesm_2015: getBundleSize('ngxfileuploader.js'),
    ngxfileuploader_fesm_2014: getBundleSize('ngxfileuploader.es5.js'),
    // CDK bundles
    cdk_umd: getBundleSize('cdk.umd.js'),
    cdk_umd_minified_uglify: getBundleSize('cdk.umd.min.js'),
    cdk_fesm_2015: getBundleSize('cdk.js'),
    cdk_fesm_2014: getBundleSize('cdk.es5.js'),
  };

  // Print the results to the console, so we can read it from the CI.
  console.log('Payload Results:', JSON.stringify(results, null, 2));

  // Publish the results to firebase when it runs on Travis and not as a PR.
  if (isTravisMasterBuild()) {
    return publishResults(results);
  }

});

/** Returns the size of the given library bundle. */
function getBundleSize(bundleName: string) {
  return getFilesize(join(bundlesDir, bundleName));
}

/** Returns the size of a file in kilobytes. */
function getFilesize(filePath: string) {
  return statSync(filePath).size / 1000;
}

/** Publishes the given results to the firebase database. */
function publishResults(results: any) {
  const latestSha = spawnSync('git', ['rev-parse', 'HEAD']).stdout.toString().trim();
  const database = openFirebaseDashboardDatabase();

  // Write the results to the payloads object with the latest Git SHA as key.
  return database.ref('payloads').child(latestSha).set(results)
    .then(() => database.goOffline(), () => database.goOffline());
}
