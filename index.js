require('dotenv').config();
const soap = require('soap');
const url = process.env.URL;
// const args = {name: 'value'};

console.log('Creating SOAP client for: ', process.env.URL);
soap.createClient(url, function(err, client) {
    if (err) {
        return console.log('Error creating SOAP client:', err.message, err.stack);
    }
    console.log('Success creating SOAP client!');
    // client.MyFunction(args, function(err, result) {
    //     console.log(result);
    // });
});
