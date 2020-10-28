require('dotenv').config();
const soap = require('soap');
const fs = require('fs');
const url = process.env.URL;

console.log('Creating SOAP client for: ', process.env.URL);
soap.createClient(url, { endpoint: url }, function(err, client) {
    if (err) {
        return console.log('Error creating SOAP client:', err.message, err.stack);
    }
    console.log('Success creating SOAP client!');
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
        const cookieValue = result.RegisterResult;
        console.log('clientId:', cookieValue);
        fs.readFile('sum.pdf', function(err, content) {
            if (err) {
                return console.log('Error reading file:', err.message, err.stack);
            }
            console.log('isBuffer(content):', Buffer.isBuffer(content));
            const insertArgs = {
                clientId: cookieValue,
                sourceName: process.env.IRC,
                sourceID: process.env.BUC,
                xmlAssociationDoc: null,
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
