import * as c from 'webidl-conversions';
import arrayProtoEntries from 'babel-runtime/core-js/array/entries';
import arrayProtoKeys from 'babel-runtime/core-js/array/keys';
import arrayProtoValues from 'babel-runtime/core-js/array/values';

import { INTERNAL } from './symbols.js';
import File from './file.js';

export default class FileList {
  constructor() {
    throw new TypeError('FileList cannot be called as a function or constructor');
  }

  item(index) {
    return this[c['unsigned long'](index)];
  }

  get length() {
    return this[INTERNAL].length;
  }
}

FileList.prototype[Symbol.iterator] = arrayProtoValues;
FileList.prototype.entries = arrayProtoEntries;
FileList.prototype.keys = arrayProtoKeys;
FileList.prototype.values = arrayProtoValues;
FileList.prototype.forEach = Array.prototype.forEach;

Object.defineProperty(FileList.prototype, Symbol.toStringTag, {
  value: 'FileListPrototype',
  writable: false,
  enumerable: false,
  configurable: true
});

export function createFileList(array) {
  const list = Object.create(FileList.prototype);
  Object.defineProperty(list, Symbol.toStringTag, {
    value: 'FileList',
    writable: false,
    enumerable: false,
    configurable: true
  });

  for (const [i, file] of array) {
    Object.defineProperty(list, i, {
      value: file,
      writable: false,
      enumerable: false,
      configurable: true
    });
  }

  list[INTERNAL] = {
    length: array.length
  };

  return list;
}
