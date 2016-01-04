import request from 'request';
import Promise from 'bluebird';
import config from '../config';

const r = Promise.promisifyAll(request);
const baseUrl = `${config.docker.registry}/v1`;

export default {
  listTags(repo) {
    return r.getAsync(`${baseUrl}/repositories/${repo}/tags/`);
  }
};
