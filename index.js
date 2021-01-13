require('dotenv').config();
const request = require('request');
require('request-debug')(request, function(type, data, r) {
    console.log('uri:', r.method, r.uri);
    console.log('type:', type);
    console.log('headers:', data.headers);
    console.log('body:', data.body);
});
const soap = require('soap');
const { create } = require('xmlbuilder2');
const fs = require('fs');
const url = process.env.URL;
const util = require('util')


const getXmlAssocDoc = () => {
    return (
        `<EntityRootData>
            <RXs>
            <RX Associate="1" UniqueID="758655" MedicationName="Nebivolol Hydrochloride" Status="Active" FirstName="Matt" LastName="Henry" FacilityUniqueID="5209" PatientBirthday="1/20/2015" PatientSSN="796-11-4091" PatientRoom="192" FacilityName="Burbank Retirement Living" />
            </RXs>
        </EntityRootData>`
    );
};

const getXml = (xmlObj) => {
    const doc = create(xmlObj);
    const xml = doc.end({headless: true});
    console.log('##\n', xml);
    return xml;
};

const getXmlArgs = (argsObj = {}) => {
    const paramsObj = {
        Parameters: {
            clientType: process.env.IRC,
            userName: process.env.USERNAME,
            // clientIPAddress: null,
        }
    };
    for (const [key, val] of Object.entries(argsObj)) {
        console.log('$$', key, val);
        paramsObj.Parameters[key] = val;
    }
    return paramsObj;
};

console.log('Creating SOAP client for: ', process.env.URL);
soap.createClient(url, { endpoint: url }, function(err, client) {
    if (err) {
        return console.log('Error creating SOAP client:', err.message, err.stack);
    }
    console.log('Success creating SOAP client!');
    console.log(util.inspect(client.describe(), false, null, true /* enable colors */));

    const xmlArgs = getXmlArgs({});
    const parametersXml = getXml(xmlArgs);
    const args = {
        command: 'GetDirectConnectVersion',
        parametersXml,
    };
    client.DirectConnectExecute(args, function(err, result) {
        if (err) {
            return console.log('Error dce:', err.message, err.stack);
        }
        console.log('Register result:', result);
    });
    // const args = {
    //     clientType: process.env.IRC,
    //     userName: process.env.USERNAME,
    //     clientIPAddress: null
    // };
    // client.Register(args, function(err, result) {
    //     if (err) {
    //         return console.log('Error registering client:', err.message, err.stack);
    //     }
    //     console.log('Register result:', result);
    //     const clientId = result.RegisterResult;
    //     console.log('clientId:', clientId);
    //     fs.readFile('sum.pdf', {encoding: 'base64'}, function(err, content) {
    //         if (err) {
    //             return console.log('Error reading file:', err.message, err.stack);
    //         }
    //         console.log('isBuffer(content):', Buffer.isBuffer(content));
    //         const insertArgs = {
    //             clientId,
    //             sourceName: process.env.BUC,
    //             sourceId: process.env.BUC,
    //             xmlAssociationDoc: getXmlAssocDoc(),
    //             mimeType: 'application/pdf',
    //             documentFile: content
    //         };
    //         client.InsertDocument(insertArgs, function(err, insertResult) {
    //             if (err) {
    //                 return console.log(err, 'Error in InsertDocument:', err.message, err.stack);
    //             }
    //             console.log('InsertDocument result:', insertResult);
    //         });
    //     });
    // });
});
