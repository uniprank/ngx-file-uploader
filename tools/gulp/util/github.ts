import {PACKAGE_VERSION} from '../constants';

const request = require('request');

/** Data that must be specified to set a Github PR status. */
export interface GithubStatusData {
  result: boolean;
  name: string;
  description: string;
  url: string;
};

/** Function that sets a Github commit status */
export function setGithubStatus(commitSHA: number, statusData: GithubStatusData) {
  const state = statusData.result ? 'success' : 'failure';
  const token = decode(process.env['MATERIAL2_GITHUB_STATUS_TOKEN']);

  const data = JSON.stringify({
    state: state,
    target_url: statusData.url,
    context: statusData.name,
    description: statusData.description
  });

  const headers =  {
    'Authorization': `token ${token}`,
    'User-Agent': `${statusData.name}/${PACKAGE_VERSION}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  };

  return new Promise((resolve) => {
    request({
      url: `https://api.github.com/repos/angular/ngxfileuploader/statuses/${commitSHA}`,
      method: 'POST',
      form: data,
      headers: headers
    }, function (error: any, response: any) {
      resolve(response.statusCode);
    });
  });
}

function decode(value: string): string {
  return value.split('').reverse().join('');
}
