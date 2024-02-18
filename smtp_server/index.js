const { SMTPServer } = require('smtp-server');
const parser = require('mailparser').simpleParser;
const server = new SMTPServer({
  // log to console
  logger: true,
  //   secure: true,

  // not required but nice-to-have
  banner: 'Welcome to SMTP Server',

  // disable STARTTLS to allow authentication in clear text mode
  disabledCommands: ['AUTH', 'STARTTLS'],

  // By default only PLAIN and LOGIN are enabled
  authMethods: ['PLAIN', 'LOGIN', 'CRAM-MD5'],

  // Accept messages up to 10 MB
  size: 10 * 1024 * 1024,

  // allow overriding connection properties. Only makes sense behind proxy
  useXClient: true,

  hidePIPELINING: true,

  // use logging of proxied client data. Only makes sense behind proxy
  useXForward: true,

  onMailFrom(address, session, callback) {
    if (/^deny/i.test(address.address)) {
      return callback(new Error('Not accepted'));
    }
    callback();
  },
  // Validate RCPT TO envelope address. Example allows all addresses that do not start with 'deny'
  // If this method is not set, all addresses are allowed
  onRcptTo(address, session, callback) {
    let err;

    if (/^deny/i.test(address.address)) {
      return callback(new Error('Not accepted'));
    }

    // Reject messages larger than 100 bytes to an over-quota user
    if (
      address.address.toLowerCase() === 'almost-full@example.com' &&
      Number(session.envelope.mailFrom.args.SIZE) > 100
    ) {
      err = new Error('Insufficient channel storage: ' + address.address);
      err.responseCode = 452;
      return callback(err);
    }

    callback();
  },
  // Setup authentication
  onAuth(auth, session, callback) {
    if (auth.username === 'username' && auth.password === 'password') {
      return callback(null, { user: 'user' });
    } else {
      return callback(new Error('Authentication failed'));
    }
  },
  onData(stream, session, callback) {
    parser(stream, {}, (err, parsed) => {
      if (err) console.log('Error:', err);

      console.log(parsed);
      stream.on('end', callback);
    });
    let message = '';
    stream.on('data', (chunk) => {
      message += chunk.toString();
    });
    stream.on('end', () => {
      console.log('Received message:');
      console.log(message);
      callback();
    });
  },
});

server.on('error', (err) => {
  console.log('Error occurred');
  console.log(err);
});
const port = 587;
// Start the server
server.listen(port, () => {
  console.log(`SMTP server listening on port ${port}`);
});
