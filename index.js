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
        console.log('clientId:', clientId);
        fs.readFile('sum.pdf', {encoding: 'base64'}, function(err, content) {
            if (err) {
                return console.log('Error reading file:', err.message, err.stack);
            }
            console.log('isBuffer(content):', Buffer.isBuffer(content));
            const insertArgs = {
                clientId,
                sourceName: process.env.BUC,
                sourceId: process.env.BUC,
                // xmlAssociationDoc: '',
                mimeType: 'application/pdf',
                documentFile: content
            };
            client.InsertDocument(insertArgs, function(err, insertResult) {
                if (err) {
                    return console.log(err, 'Error in InsertDocument:', err.message, err.stack);
                }
                console.log('InsertDocument result:', insertResult);
            });
        });
        
    });
});
