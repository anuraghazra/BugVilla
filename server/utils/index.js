exports.extractUsernameFromEmail = emailStr => {
  return emailStr.replace(/\./g, '').match(/([^@]+)/)[1];
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};
