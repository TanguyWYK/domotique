'use strict';

const RELATIVE_PATH = {
    controllers: 'app/controllers/',
    views: 'app/views/',
};
let Display = false;

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

function loadView() {
    let now = new Date();
    postXHR('home', {
        action: 'readLastMeasures',
        id_captors: JSON.stringify([0,1,2,3,4])
    }).then(data => {
        displayPanel(data);
        displayGraph([]);
    });
}

function convertDateToMySQL(date) {
    return (new Date(addHoursToDate(date, 2)).toISOString()).slice(0, 19).replace('T', ' ');
}

function addHoursToDate(date, hours) {
    let dateTime = new Date(date);
    dateTime.setHours(dateTime.getHours() + hours);
    return dateTime;
}

loadView();