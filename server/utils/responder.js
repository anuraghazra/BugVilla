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

module.exports = {
  send200Response,
  sendErrorResponse,
};