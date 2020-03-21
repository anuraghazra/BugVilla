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

  res.status(200)
    .cookie('jwt', token, { maxAge: 2 * 3600000, httpOnly: true })
    // .redirect('http://localhost:3000')
    .send(`
    <html>
      <head>
        <title>BugVilla</title>
      </head>
      <body>
      <p>BugVilla Authorized.</p>
      <p>You can close this window now</p>
      <script>
        window.onload = window.close();
        let originUrl = window.location.origin;
        if (window.location.hostname === 'localhost') {
          originUrl = 'http://localhost:3000'
        }
        window.opener.postMessage('success', originUrl);
      </script>
      </body>
    </html>
  `)
}