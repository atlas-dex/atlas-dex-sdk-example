const axios = require('axios');
const {BASE_URL} = require('./constants')
const getHttpResponse = async function getHttpResponse (httpMethod,endpoint, body) {
    try {
        console.log('body', body);
        const options = {
            method: httpMethod,
            url:   BASE_URL + endpoint,
            data: body
          };
         const data = await axios(options);
         return data.data;
    }
    catch (e) {
        console.log('error at http call', endpoint, body, e);
    }
}

module.exports = {
    getHttpResponse
}