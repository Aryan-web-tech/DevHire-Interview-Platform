const Stream = require('@stream-io/node-sdk');

const streamClient = new Stream.StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_SECRET_KEY
);

module.exports = streamClient;
