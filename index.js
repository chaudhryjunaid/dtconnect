require('dotenv').config();
const soap = require('soap');
const url = process.env.URL;

console.log('Creating SOAP client for: ', process.env.URL);
soap.createClient(url, function(err, client) {
    if (err) {
        return console.log('Error creating SOAP client:', err.message, err.stack);
    }
    console.log('Success creating SOAP client!');
    const args = {
        sClientType: process.env.IRC,
        sUserName: process.env.USERNAME,
        sClientIPAddress: null
    };
    client.Register(args, function(err, result) {
        if (err) {
            return console.log('Error registering client:', err.message, err.stack);
        }
        console.log('Register result:', result);
    });
});
