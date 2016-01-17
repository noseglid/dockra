import { readFile } from 'fs';
import { parse } from 'url';
import Docker from 'dockerode';
import Promise from 'bluebird';
import { DockerEvents, PullEvents } from './docker-classes';
import config from '../config';

const readFileAsync = Promise.promisify(readFile);
const handleCache = {};

Promise.config({
  cancellation: true
});

function getHandle() {
  const host = config.get('docker.host');
  const certPath = config.get('docker.certPath');
  if (!host || !certPath) {
    return Promise.reject(new Error('Docker connection not configured'));
  }

  const cacheKey = `${host}-${certPath}`;
  if (handleCache[cacheKey]) {
    return Promise.resolve(handleCache[cacheKey]);
  }

  const parsedUrl = parse(host);

  return Promise.all([
    readFileAsync(`${certPath}/ca.pem`),
    readFileAsync(`${certPath}/cert.pem`),
    readFileAsync(`${certPath}/key.pem`)
  ]).spread((ca, cert, key) => {
    return (handleCache[cacheKey] = Promise.promisifyAll(new Docker({
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      ca: ca,
      cert: cert,
      key: key
    })));
  });
}

const createContainer = (...args) => getHandle().then(handle => handle.createContainerAsync(...args));
const getContainer = (id) => getHandle().then(handle => Promise.promisifyAll(handle.getContainer(id)));
const listContainers = (...args) => getHandle().then(handle => handle.listContainersAsync(...args));

const listImages = (...args) => getHandle().then(handle => handle.listImagesAsync(...args));
const getImage = (id) => getHandle().then(handle => Promise.promisifyAll(handle.getImage(id)));

const pull = (repo) => getHandle()
  .then(handle => handle.pullAsync(repo))
  .then(stream => new PullEvents(stream));

const exec = (containerId, opts) => getContainer(containerId)
  .then(container => container.execAsync(opts))
  .then(e => Promise.promisifyAll(e));

const searchImages = (term) => getHandle().then(handle => handle.searchImagesAsync({ term: term }));

const getEvents = () => getHandle()
  .then(handle => handle.getEventsAsync())
  .then(stream => new DockerEvents(stream));

export default {
  createContainer: createContainer,
  getContainer: getContainer,
  listContainers: listContainers,
  listImages: listImages,
  getImage: getImage,
  pull: pull,
  exec: exec,
  searchImages: searchImages,
  getEvents: getEvents
};
