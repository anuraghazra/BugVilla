const jwt = require('jsonwebtoken');

module.exports = function generateUserToken(req, res) {
  let user = req.user;

  // Create JWT Token
  const token = jwt.sign({
    sub: user.id,
    isVerified: user.isVerified,
    provider: user.provider,
    username: user.username,
    name: user.name,
    email: user.email,
    googleId: user.googleId
  }, process.env.TOKEN_SECRET, { expiresIn: '2h' });

  console.log('OAUTH')
  res.status(200)
    .cookie('jwt', token)
    .send(`
      <html>
        <body>
        <script>
        window.onload = window.close();
        window.opener.postMessage('OAuth Success', "http://localhost:3000");
        </script>
        </body>
      </html>
    `)
}