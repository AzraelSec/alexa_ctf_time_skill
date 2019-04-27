'use stricts'
const helpers = require('./helpers');
const request = require('request');
const Speech = require('ssml-builder');

const endpoints = require('./assets/endpoints');

module.exports.GetNextEvent = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetNextEvent';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log("GetNextEvent started");
        return new Promise((resolve) => {
            getNextEvent(attrs)
            .then((event) => resolve(handlerInput.responseBuilder.speak(event).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(attrs.t('ERROR_MESSAGE')).getResponse());
            })
        });
    }
};
function getNextEvent(attrs) {
    return new Promise((resolve, reject) => {
        requestNextEventsSet(new Date())
        .then((events) => {
            console.log(`Events received: ${JSON.stringify(events)}`);
            let speech = new Speech();
            speech.sentence(attrs.t('INFORMATIONS.NEXT_EVENT.START_MESSAGE'));
            speech.sayWithSSML(`<s>${getEventString(attrs, events[0], false)}</s>`);
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}

module.exports.GetNextEvents = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetNextEvents';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log("GetNextEvents started");
        const number = handlerInput.requestEnvelope.request.intent.slots.number.value || 5;
        //insert a startByDate slot to look for events from a specific date
        const date = new Date();
        return new Promise((resolve) => {
            getNextEvents(attrs, date, number)
            .then((events) => resolve(handlerInput.responseBuilder.speak(events).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(attrs.t('ERROR_MESSAGE')).getResponse());
            });
        })
    }
};
function getNextEvents(attrs, startDate, number) {
    return new Promise((resolve, reject) => {
        requestNextEventsSet(startDate, number)
        .then(events => {
            console.log(`Events received: ${JSON.stringify(events)}`);
            let speech = new Speech();
            speech.sentence(attrs.t('INFORMATIONS.NEXT_EVENTS.START_MESSAGE' , events.length));
            for(let i = 0; i < events.length; i++)
            {
                const and = (i === events.length - 1 && events.length !== 1);
                const event = events[i];
                //to refactor in a better way
                speech.sayWithSSML(`<s>${getEventString(attrs, event, and)}</s>`);
            }
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}
function getEventString(attrs, event, and) {
    const title = event.title;
    const type = event.format;
    const eventStartDate = getDateString(event.start);
    const duration = getDurationString(event.duration);
    return `${and ? attrs.t('CONJUNCTION') : ''}${attrs.t('INFORMATIONS.NEXT_EVENTS.EVENT_DESCRIPTION', title, type, eventStartDate, duration)}`;
}
function getDateString(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    //Javascript month enumeration fixing...
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    //this should be fixed using the ssml library
    return `<say-as interpret-as="date" format="dmy">${day}/${month}/${year}</say-as>`;
}
function getDurationString(duration) {
    return `${duration.days !== 0 ? duration.days : ''}${duration.hours !== 0 ? duration.hours : ''}`;
}
function requestNextEventsSet(startDate, number) {
    return new Promise((resolve, reject) => {
        //UNIX timestamp adjusting...
        const startDateTime = startDate.getTime() / 1000;
        let options = helpers.getCTFTimeRequestOptions(endpoints.eventsEndPoint());
        //GET request query sting's parameters
        options.qs = {};
        if(startDateTime) options.qs.start = startDateTime;
        if(number) options.qs.limit = number;
        request(options, (err, res, body) => {
            console.log(`Fetched data: ${JSON.stringify(body)}`);
            if(err) reject(err);
            else resolve(body);
        });
    });
}