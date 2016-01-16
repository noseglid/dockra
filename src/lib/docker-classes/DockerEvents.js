import { EventEmitter } from 'events';
import docker from '../docker';

export default class DockerEvents extends EventEmitter {
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
      this.emit(ev.status, docker.getContainer(ev.id));
    }
    if (imageEvents.indexOf(ev.status) !== -1) {
      this.emit(ev.status, docker.getImage(ev.id));
    }
  };
}
