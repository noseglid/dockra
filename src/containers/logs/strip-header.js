import { Transform } from 'stream';

export default class StripHeader extends Transform {
  constructor() {
    super({ objectMode: true });
    this.nextChunkIsHeader = true;
  }

  _transform(chunk, enc, cb) {
    if (!this.nextChunkIsHeader) {
      this.push(chunk + '\r');
    }

    this.nextChunkIsHeader = !this.nextChunkIsHeader;
    cb();
  }
}
