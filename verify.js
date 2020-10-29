require('dotenv').config();
const soap = require('soap');
const fs = require('fs');
const url = process.env.URL;
const util = require('util')

console.log('Creating SOAP client for: ', process.env.URL);
soap.createClient(url, { endpoint: url }, function(err, client) {
    if (err) {
        return console.log('Error creating SOAP client:', err.message, err.stack);
    }
    console.log('Success creating SOAP client!');
    console.log(util.inspect(client.describe(), false, null, true /* enable colors */));

    const args = {
        clientType: process.env.IRC,
        userName: process.env.USERNAME,
        clientIPAddress: null
    };
    client.Register(args, function(err, result) {
        if (err) {
            return console.log('Error registering client:', err.message, err.stack);
        }
        console.log('Register result:', result);
        const clientId = result.RegisterResult;
        const batchId = process.argv[2];
        console.log('Calling GetInsertDocuments for:', batchId);
        const verifyArgs = {
            clientId,
            batchId
        };
        client.GetInsertDocuments(verifyArgs, function(err, getDocsResult) {
            if (err) {
                return console.log('Error in GetInsertDocuments:', err.message, err.stack);
            }
            console.log('GetInsertDocuments result:', getDocsResult);
        });
    });
});
