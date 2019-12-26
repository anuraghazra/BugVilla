const {
  CREATED,
  DELETED,
  NOT_FOUND,
  FORBIDDEN,
  OK,
  UNPROCESSABLE,
  CONFLICT,
  INTERNAL_ERROR,
  UNSUPPORTED_MEDIA,
  PAYLOAD_TOO_LARGE,
} = require('../constants');

const httpResponder = function (req, res, next) {
  res.forbidden = (data) => res.status(FORBIDDEN).json(data);
  res.notFound = (data) => res.status(NOT_FOUND).json(data);
  res.ok = (data) => res.status(OK).json(data);
  res.unprocessable = (data) => res.status(UNPROCESSABLE).json(data);
  res.conflict = (data) => res.status(CONFLICT).json(data);

  res.deleted = (data) => res.status(DELETED).json(data);
  res.created = (data) => res.status(CREATED).json(data);
  res.internalError = (data) => res.status(INTERNAL_ERROR).json(data);
  res.unsupportedMedia = (data) => res.status(UNSUPPORTED_MEDIA).json(data);
  res.payloadTooLarge = (data) => res.status(PAYLOAD_TOO_LARGE).json(data);

  next()
}

module.exports = httpResponder