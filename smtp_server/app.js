const smtp = require('smtp2');
const serveremail = smtp.createServer();
serveremail.on('client', (client) => {
    console.log('Client connected');
    client.on('QUIT', () => {
        console.log('Client disconnect');
    });
});
serveremail.on('message', (message) => {
    console.log('Incoming Message:', message);
});
serveremail.listen(2525);
