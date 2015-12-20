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

const getContainer = (id) => Promise.promisifyAll(handle.getContainer(id));
const listContainers = (...args) => handle.listContainersAsync(...args);

export { getContainer, listContainers };
