import request from 'request';
import Promise from 'bluebird';
import config from '../config';

const r = Promise.promisifyAll(request);
const baseUrl = `${config.docker.registry}/v1`;

export default {
  listTags(repo) {
    return r.getAsync(`${baseUrl}/repositories/${repo}/tags`, { json: true })
      .then(response => {
        if (response.statusCode >= 300) {
          throw new Error(`Could not list tags for '${repo}'.`);
        }

        return response.body;
      });
  }
};
