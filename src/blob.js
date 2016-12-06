import { INTERNAL } from './symbols.js';

export default class Blob {
  constructor() {
    Object.defineProperty(this, Symbol.toStringTag, {
      value: 'Blob',
      writable: false,
      enumerable: false,
      configurable: true
    });

    this[INTERNAL].closed = false;
    this[INTERNAL].type = '';

    const blobParts = arguments[0];
    const options = arguments[1];

    const buffers = [];

    if (blobParts) {
      const a = blobParts;
      const length = Number(a.length);
      for (let i = 0; i < length; i++) {
        const element = a[i];
        let buffer;
        if (element instanceof Buffer) {
          buffer = element;
        } else if (ArrayBuffer.isView(element)) {
          buffer = new Buffer(new Uint8Array(element.buffer, element.byteOffset, element.byteLength));
        } else if (element instanceof ArrayBuffer) {
          buffer = new Buffer(new Uint8Array(element));
        } else if (element instanceof Blob) {
          buffer = element[INTERNAL].buffer;
        } else {
          buffer = new Buffer(typeof element === 'string' ? element : String(element));
        }
        buffers.push(buffer);
      }
    }

    this[INTERNAL].buffer = Buffer.concat(buffers);

    let type = options && options.type !== undefined && String(options.type).toLowerCase();
    if (type && !/[^\u0020-\u007E]/.test(type)) {
      this[INTERNAL].type = type;
    }
  }
  get size() {
    return this[INTERNAL].closed ? 0 : this[INTERNAL].buffer.length;
  }
  get type() {
    return this[INTERNAL].type;
  }
  get isClosed() {
    return this[INTERNAL].closed;
  }
  slice() {
    const size = this.size;

    const start = arguments[0];
    const end = arguments[1];
    let relativeStart, relativeEnd;
    if (start === undefined) {
      relativeStart = 0;
    } else if (start < 0) {
      relativeStart = Math.max(size + start, 0);
    } else {
      relativeStart = Math.min(start, size);
    }
    if (end === undefined) {
      relativeEnd = size;
    } else if (end < 0) {
      relativeEnd = Math.max(size + end, 0);
    } else {
      relativeEnd = Math.min(end, size);
    }
    const span = Math.max(relativeEnd - relativeStart, 0);

    const buffer = this[INTERNAL].buffer;
    const slicedBuffer = buffer.slice(
      relativeStart,
      relativeStart + span
    );
    const blob = new Blob([], { type: arguments[2] });
    blob[INTERNAL].buffer = slicedBuffer;
    blob[INTERNAL].closed = this[INTERNAL].closed;
    return blob;
  }
  close() {
    this[INTERNAL].closed = true;
  }
}

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  value: 'BlobPrototype',
  writable: false,
  enumerable: false,
  configurable: true
});
