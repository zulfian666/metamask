/* eslint-disable import/unambiguous */
const { ObjectMultiplex } = require('@metamask/object-multiplex');
const { pipeline, Transform } = require('readable-stream');

const {
  EXTENSION_MESSAGES,
} = require('../../../shared/constants/extension-messages');

/**
 * Sets up stream multiplexing for the given stream
 *
 * @param {any} connectionStream - the stream to mux
 * @returns {stream.Stream} the multiplexed stream
 */
function setupMultiplex(connectionStream) {
  const mux = new ObjectMultiplex();
  /**
   * We are using this streams to send keep alive message between backend/ui without setting up a multiplexer
   * We need to tell the multiplexer to ignore them, else we get the " orphaned data for stream " warnings
   * https://github.com/MetaMask/object-multiplex/blob/280385401de84f57ef57054d92cfeb8361ef2680/src/ObjectMultiplex.ts#L63
   */
  mux.ignoreStream(EXTENSION_MESSAGES.CONNECTION_READY);
  pipeline(connectionStream, mux, connectionStream, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return mux;
}

/**
 * Checks if a stream is writable and usable
 *
 * @param {stream.Stream} stream - the stream to check
 * @returns {boolean} if the stream can be written to
 */
function isStreamWritable(stream) {
  /**
   * Roughly:
   *   stream.writable:
   *     readable-stream-3 (confusingly: not mentioned in docs for streamsv2 and not consistently implemented there, despite v3 docs mentioning it as older)
   *     readable-stream-4/NodeStream (here it's mentioned as introduced much later)
   *   stream.destroyed:
   *     readable-stream-4/NodeStream (docs mention it as introduced in v2 despite being absent from both implementation and docs of v2 and v3)
   *   stream._writableState.ended:
   *     Present in all implementations, seems like the most reasonable fallback for legacy.
   *
   * The only accurate references seem to be sources for Node.js and readable-stream. Intended compatibility must be ensured by tests.
   */

  return Boolean(
    stream.writable && !stream.destroyed && !stream._writableState?.ended,
  );
}

/**
 * Utility function to create a passthrough-stream form objects with optional transformation.
 * Ported from through2.
 *
 * @param {(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void): void} transform - Stream-transformation to apply
 * @param {(callback: (error?: Error | null, data?: any) => void): void} flush - flush callback
 * @param {import("readable-stream").TransformOptions} options - Additional options passed to Transform constructor
 * @returns {Transform} A stream object
 */
function createThroughStream(transform, flush, options = {}) {
  return new Transform({
    flush,
    highWaterMark: 16,
    objectMode: true,
    transform,
    ...options,
  });
}

module.exports = {
  createThroughStream,
  isStreamWritable,
  setupMultiplex,
};
