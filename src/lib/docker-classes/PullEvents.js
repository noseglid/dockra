import { EventEmitter } from 'events';

export default class PullEvents extends EventEmitter {
  constructor(pullStream) {
    super();

    this.pullStream = pullStream;
    this.pullStream.on('data', this.handleData);
    this.pullStream.on('end', this.handleEnd);
    this.pullStream.on('error', this.handleError);
    this.layers = [];
  }

  destroy = () => {
    this.pullStream.removeListener('data', this.handleData);
    this.pullStream.removeListener('end', this.handleEnd);
    this.pullStream.removeListener('error', this.handleError);
    this.pullStream.destroy();
  };

  getLayers = () => {
    return this.layers;
  };

  updateProcessingSpeed = (ev) => {
    const now = new Date();
    const byteDiff = (ev.progressDetail.current - this.layers[ev.id].speed.lastBytes);
    const timeDiff = now - this.layers[ev.id].speed.lastUpdate;
    this.layers[ev.id].speed = {
      bytesPerSecond: 1000 * Math.round(byteDiff / timeDiff),
      lastUpdate: now,
      lastBytes: ev.progressDetail.current
    };
  };

  updateLayer = (ev) => {
    this.layers[ev.id].ev = ev;
    const now = new Date();
    if (ev.progressDetail.current && ev.progressDetail.total &&
      1000 < now - this.layers[ev.id].speed.lastUpdate) {
      this.updateProcessingSpeed(ev);
    }
  };

  newLayer = (ev) => {
    this.layers[ev.id] = {
      ev: ev,
      speed: {
        lastUpdate: new Date(),
        lastBytes: 0,
        bytesPerSecond: 0
      }
    };
  };

  handleEnd = () => {
    this.emit('end');
  };

  handleError = (...args) => {
    this.emit('error', args);
  };

  handleData = (buffer) => {
    const ev = JSON.parse(buffer.toString('utf8'));
    if (ev.error) {
      this.destroy();
      this.emit('end');
      return;
    }

    if (!ev.progressDetail) {
      /* not layer progress event */
      return;
    }

    (ev.id in this.layers ? this.updateLayer : this.newLayer)(ev);
    this.emit('tick');
  };
}
