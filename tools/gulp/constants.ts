import {join} from 'path';

export const PACKAGE_VERSION = require('../../package.json').version;

export const PROJECT_ROOT = join(__dirname, '../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');

/** Root build output directory */
export const DIST_ROOT = join(PROJECT_ROOT, 'dist');

/** Output subdirectory where all bundles will be written (flat ES modules and UMD) */
export const DIST_BUNDLES = join(DIST_ROOT, 'bundles');

/** Output subdirectory where all library artifacts will be written (compiled JS, CSS, etc.) */
export const DIST_THISAPP = join(DIST_ROOT, 'packages', 'ngxfileuploader');
export const DIST_CDK = join(DIST_ROOT, 'packages', 'cdk');
export const DIST_DEMOAPP = join(DIST_ROOT, 'packages', 'demo-app');
export const DIST_E2EAPP = join(DIST_ROOT, 'packages', 'e2e-app');
export const DIST_EXAMPLES = join(DIST_ROOT, 'packages', 'examples');

export const DIST_RELEASES = join(DIST_ROOT, 'releases');

export const COVERAGE_RESULT_FILE = join(DIST_ROOT, 'coverage', 'coverage-summary.json');

export const HTML_MINIFIER_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

export const LICENSE_BANNER = `/**
  * @license This package library v${PACKAGE_VERSION}
  * Copyright (c) 2017 FUERSTVONMARTIN GmbH https://fuerstvonmartin.de/
  * License: MIT
  */`;

export const COMPONENTS_DIR = join(SOURCE_ROOT, 'lib');
