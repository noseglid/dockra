import fs from 'fs';
import os from 'os';
import _ from 'lodash';
import EventEmitter from 'events';

const defaultConfig = {
  docker: {
    registry: 'https://registry.hub.docker.com',
    host: '',
    certPath: ''
  },
  dockerMachine: {
    executable: ''
  }
};

class Config extends EventEmitter {
  constructor() {
    super();
    this.cfgDir = `${os.homedir()}/.dockra`;
    this.cfgFile = `${this.cfgDir}/config.json`;
    this.config = defaultConfig;

    try {
      this.config = JSON.parse(fs.readFileSync(this.cfgFile).toString('utf8'));
    } catch (e) {
      fs.mkdir(this.cfgDir);
      this.writeConfig();
    }
  }

  writeConfig = _.debounce(() => {
    fs.writeFileSync(this.cfgFile, JSON.stringify(this.config, null, 2));
  }, 1000);

  get = (...args) => {
    return _.get(this.config, ...args);
  };

  set = (...args) => {
    _.set(this.config, ...args);
    this.emit(`changed:${args[0]}`, args[1]);
    this.writeConfig();
  };
}

export default new Config();
