import Network from '../network/Network';

function getApi(url, param, headers = '') {
    console.log('******params', param)
    return new Promise((resolve, reject) => {
        Network.apiRequest(url, 'GET', null, param, headers)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}
function postApi(url, body, headers = '') {
    return new Promise((resolve, reject) => {
        Network.apiRequest(url, 'POST', body, null, headers)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}

function putApi(url, body, headers = '') {
    return new Promise((resolve, reject) => {
        Network.apiRequest(url, 'PUT', body, null, headers)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}

function deleteApi(url, body, headers = '') {
    return new Promise((resolve, reject) => {
        Network.apiRequest(url, 'DELETE', body, null, headers)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}


function getDirectApi(param, type, directParam = '', headers = '', useDirectUrl = false) {
    console.log('******params', param)
    return new Promise((resolve, reject) => {
        Network.apiDirectRequest('GET', null, param, type, directParam, headers, useDirectUrl)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}

function postDirectApi(body, type, directParam = '', headers = '') {
    return new Promise((resolve, reject) => {
        Network.apiDirectRequest('POST', body, null, type, directParam, headers)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    });
}


export default {
    getApi,
    postApi,
    putApi,
    deleteApi,
    getDirectApi,
    postDirectApi

}