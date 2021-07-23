'use strict';

const RELATIVE_PATH = {
    controllers: 'app/controllers/',
    views: 'app/views/',
};

function getXHR_url(url, parameters = {}) {
    return new Promise(resolve => {
        let uri = Object.keys(parameters).length > 0 ? '?' + encodeURIObject(parameters) : '';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url + uri);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = (data) => {
            if (xhr.getResponseHeader('Content-Type').includes('json')) {
                resolve(JSON.parse(data.target['response']));
            } else {
                resolve(data.target['response']);
            }
        };
        xhr.send();
    });
}

function postXHR(controller, parameters = {}) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', RELATIVE_PATH.controllers + controller + '.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = (data) => {
            if (xhr.getResponseHeader('Content-Type').includes('json')) {
                resolve(JSON.parse(data.target['response']));
            } else {
                resolve(data.target['response']);
            }
        };
        xhr.send(encodeURIObject(parameters));
    });
}

function decodeURIObject(url) {
    let response = {};
    let parts = url.split('&');
    for (let part of parts) {
        let [key, value] = part.split('=');
        response[key] = value;
    }
    return response;
}

function encodeURIObject(data) {
    let keys = Object.keys(data);
    let response = [];
    for (let key of keys) {
        response.push(key + '=' + data[key])
    }
    return encodeURI(response.join('&'));
}

/**
 *
 * @param {{
        temperature: string,
        humidity: string,
        date: string
     }} data
 */
function updatePanel() {
    postXHR('home', {
        action: 'readCaptors',
        id_captor: 1,
    }).then(data => {
        let temperature = (data.temperature / 100).toFixed(2);
        let humidity = (data.humidity / 100).toFixed(2);
        let date = data.date.split(' ')[1];
        document.getElementById('temperature').innerText = temperature;
        document.getElementById('humidity').innerText = humidity;
        document.getElementById('date').innerText = date;
    });
}
updatePanel();
