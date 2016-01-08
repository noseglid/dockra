import { readFileSync } from 'fs';
import { parse } from 'url';
import Docker from 'dockerode';
import Promise from 'bluebird';
import config from '../config';

const parsedUrl = parse(config.docker.host);
const certpath = config.docker.certPath;
const handle = Promise.promisifyAll(new Docker({
  host: parsedUrl.hostname,
  port: parsedUrl.port,
  ca: readFileSync(certpath + '/ca.pem'),
  cert: readFileSync(certpath + '/cert.pem'),
  key: readFileSync(certpath + '/key.pem')
}));

const createContainer = (...args) => handle.createContainerAsync(...args);
const getContainer = (id) => Promise.promisifyAll(handle.getContainer(id));
const listContainers = (...args) => handle.listContainersAsync(...args);

const listImages = (...args) => handle.listImagesAsync(...args);
const getImage = (id) => Promise.promisifyAll(handle.getImage(id));

const pull = (repo) => handle.pullAsync(repo);

const exec = (containerId, opts) => getContainer(containerId).execAsync(opts)
  .then(e => Promise.promisifyAll(e));

export default {
  createContainer: createContainer,
  getContainer: getContainer,
  listContainers: listContainers,
  listImages: listImages,
  getImage: getImage,
  pull: pull,
  exec: exec
};
