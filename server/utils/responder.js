const { NOT_FOUND } = require('../constants')

function send200Response(res, data) {
  res.json({
    ok: true,
    data,
  });
}

function sendErrorResponse(res, status, err) {
  res.status(status)
    .json({ message: 'Something went wrong', error: err })
}

function send404Response(res) {
  res.status(NOT_FOUND).json({ error: 'Not found' })
}

module.exports = {
  send200Response,
  sendErrorResponse,
  send404Response
};