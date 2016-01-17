import request from 'request';
import Promise from 'bluebird';
import config from '../config';

function req(opts) {
  const promisedRequest = Promise.promisify(request).defaults({
    baseUrl: `${config.get('docker.registry')}/v1`,
    json: true
  });

  return promisedRequest(opts)
    .then(response => {
      if (response.statusCode >= 300) {
        throw new Error(`Failed to ${opts.method.toUpperCase()} '${opts.uri}'.`);
      }

      return response.body;
    });
}

export default {
  listTags(repo) {
    return req({
      method: 'GET',
      url: `repositories/${repo}/tags`
    });
  }
};
