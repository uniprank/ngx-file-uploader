#!/bin/bash

find . -name "*.js" -type f -and -not -path "./node_modules/*" -and -not -path "./scripts/*"  -and -not -path "./tools/*" -and -not -path "./example/*" -and -not -path "./gulpfile.js" -and -not -path "./webpack.config.js" -and -not -path "./system.config.js" -and -not -path "./build.js" -delete
find . -name "*.js.map" -type f -not -path "./node_modules/*" -delete
find . -name "*.d.ts" -type f -not -path "./node_modules/*" -delete
find . -name "*.metadata.json" -type f -not -path "./node_modules/*" -delete
rm -rf aot/
rm -rf bundles/
rm -rf lib/
