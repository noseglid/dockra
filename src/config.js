import fs from 'fs';
import os from 'os';
import _ from 'lodash';

const defaultConfig = {
  docker: {
    registry: 'https://registry.hub.docker.com'
  }
};

let config = defaultConfig;

const cfgDir = `${os.homedir()}/.dockra`;
const cfgFile = `${cfgDir}/config.json`;

function writeConfig() {
  fs.writeFileSync(cfgFile, JSON.stringify(config, null, 2));
}

try {
  config = JSON.parse(fs.readFileSync(cfgFile).toString('utf8'));
} catch (e) {
  fs.mkdir(cfgDir);
  writeConfig();
}

const get = (...args) => {
  return _.get(config, ...args);
};

const set = (...args) => {
  _.set(config, ...args);
  writeConfig();
};

export default { get, set };
