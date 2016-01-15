import { readFileSync } from 'fs';
import { EventEmitter } from 'events';
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

const searchImages = (term) => handle.searchImagesAsync({ term: term });

const getEvents = () => handle.getEventsAsync().then(stream => {
  const DockerEvents = class DockerEvents extends EventEmitter {
    constructor(dockerStream) {
      super();
      this.dockerStream = dockerStream;
      this.dockerStream.on('data', this.handleData);
    }

    destroy() {
      this.dockerStream.removeListener('data', this.handleData);
      this.dockerStream.destroy();
    }

    handleData = (buffer) => {
      const ev = JSON.parse(buffer.toString('utf8'));
      const containerEvents = [
        'attach',
        'commit',
        'copy',
        'create',
        'destroy',
        'die',
        'exec_create',
        'exec_start',
        'export',
        'kill',
        'oom',
        'pause',
        'rename',
        'resize',
        'restart',
        'start',
        'stop',
        'top',
        'unpause'
      ];
      const imageEvents = [
        'delete',
        'import',
        'pull',
        'push',
        'tag',
        'untag'
      ];
      if (containerEvents.indexOf(ev.status) !== -1) {
        this.emit(ev.status, getContainer(ev.id));
      }
      if (imageEvents.indexOf(ev.status) !== -1) {
        this.emit(ev.status, getImage(ev.id));
      }
    };
  };

  return new DockerEvents(stream);
});

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
