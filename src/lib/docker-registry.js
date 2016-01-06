import request from 'request';
import Promise from 'bluebird';
import config from '../config';

const promisedRequest = Promise.promisify(request).defaults({
  baseUrl: `${config.docker.registry}/v1`,
  json: true
});

function req(opts) {
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
  },

  searchRepo(query) {
    return req({
      method: 'GET',
      url: 'search',
      qs: { q: query }
    });
  }
};
