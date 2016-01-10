import stream from 'stream';

export default class StripHeader extends stream.Transform {
  constructor() {
    super({ objectMode: true });
    this.nextChunkIsHeader = true;
  }

  _transform(chunk, enc, cb) {
    console.log(enc);
    if (!this.nextChunkIsHeader) {
      this.push(chunk + '\r');
    }

    this.nextChunkIsHeader = !this.nextChunkIsHeader;
    cb();
  }
}
