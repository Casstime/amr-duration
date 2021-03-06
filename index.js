const fs = require('fs');
const stream = require('stream');
const util = require('util');

/**
 * @param {string|stream|buffer} amr
 * @param {function} [callback]
 */
function getDuration(amr, callback) {
  if (Buffer.isBuffer(amr)) {
    return getDurationByBuffer(amr, callback);
  }

  if (util.isString(amr)) {
    return getDurationByFilename(amr, callback);
  }

  if (isReadableStream(amr)) {
    return getDurationByStream(amr, callback);
  }

  callback(new Error('Type of [amr] must be String, Buffer or Readable Stream'));
}

function getDurationByStream(stream, callback) {
  const chunks = [];
  stream
    .on('data', (chunk) => {
      chunks.push(chunk);
    })
    .on('error', (err) => {
      callback(err);
    })
    .on('end', () => {
      const buffer = Buffer.concat(chunks);
      getDurationByBuffer(buffer, callback);
    });
}

function getDurationByFilename(filename, callback) {
  fs.readFile(filename, (err, data) => {
    if (err) {
      return callback(err);
    }
    getDurationByBuffer(data, callback);
  });
}

function getDurationByBuffer(buffer, callback) {
  const NB_MAGIC_NUMBER = '#!AMR\n';
  const WB_MAGIC_NUMBER = '#!AMR-WB\n';

  const NBPackedByte = [12, 13, 15, 17, 19, 20, 26, 31, 5, 0, 0, 0, 0, 0, 0, 0];
  const WBPackedByte = [17, 22, 32, 36, 40, 46, 50, 58, 60, 5, 0, 0, 0, 0, 0, 0];

  let MAGIC_NUMBER;
  let PackedByte;

  if (buffer.indexOf(NB_MAGIC_NUMBER) === 0) {
    MAGIC_NUMBER = NB_MAGIC_NUMBER;
    PackedByte = NBPackedByte;
  } else if (buffer.indexOf(WB_MAGIC_NUMBER) === 0) {
    MAGIC_NUMBER = WB_MAGIC_NUMBER;
    PackedByte = WBPackedByte;
  } else {
    return callback(new Error(`Buffer not starts with ${NB_MAGIC_NUMBER} or ${WB_MAGIC_NUMBER}`));
  }

  let pos = MAGIC_NUMBER.length;
  let frameCount = 0;

  while (buffer[pos]) {
    const nextByte = buffer[pos];
    const frameHeader = parseFrameHeader(nextByte);
    const voiceSize = PackedByte[frameHeader.FT];
    const frameSize = 1 + voiceSize;
    pos += frameSize;
    frameCount++;
  }

  callback(null, frameCount * 20);
}

function parseFrameHeader(headerByte) {
  const Q = (headerByte & parseInt('100', 2)) >> 2;
  const FT = headerByte >> 3;
  return {Q, FT}
}

function isReadableStream(obj) {
  return obj instanceof stream.Readable;
}

/**
 * get amr duration
 * @param {string|stream|buffer} amr
 * @param {function} [callback]
 * @return {Promise}
 */
module.exports = function (amr, callback) {
  return new Promise((resolve, reject) => {
    getDuration(amr, (err, duration) => {
      if (callback) {
        callback(err, duration);
      }

      if (err) {
        return reject(err);
      }

      resolve(duration);
    })
  });
};
