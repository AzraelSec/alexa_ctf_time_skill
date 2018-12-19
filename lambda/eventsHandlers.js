'use stricts'
const helpers = require('./helpers');
const endpoints = require('./assets/endpoints');
const request = require('request');
const Speech = require('ssml-builder');

module.exports.GetNextEvents = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetNextEvents';
    },
    handle(handlerInput) {
        const number = handlerInput.requestEnvelope.request.intent.slots.number.value || 5;
        //insert a startByDate slot to look for starting from a specific date
        const date = new Date();
        return new Promise((resolve) => {
            getNextEvents(date, number)
            .then((events) => resolve(handlerInput.responseBuilder.speak(events).reprompt(events).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(messages.INFORMATIONS.ERROR_MESSAGE).reprompt(messages.INFORMATIONS.ERROR_MESSAGE).getResponse());
            });
        })
    }
};
function getNextEvents(startDate, number) {
    return new Promise((resolve, reject) => {
        requestNextEventsSet(startDate, number)
        .then((events) => {
            console.log(`Events received: ${JSON.stringify(events)}`);
            let speech = new Speech();
            speech.sentence(messages.INFORMATIONS.NEXT_EVENTS.START_MESSAGE.replace('{1}', events.length));
            for(let i = 0; i < events.length; i++)
            {
                const and = (i === events.length - 1 && events.length !== 1);
                const event = events[i];
                //to refactor in a better way
                speech.sayWithSSML(`<s>${getEventString(event, and)}</s>`);
            }
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}
function getEventString(event, and) {
    const title = event.title;
    const type = event.format;
    const eventStartDate = getDateString(event.start);
    const duration = getDurationString(event.duration);
    return `${and ? ' e ' : ''}${messages.INFORMATIONS.NEXT_EVENTS.EVENT_DESCRIPTION.replace('{1}', title).replace('{2}', type).replace('{3}', eventStartDate).replace('{4}', duration)}`;
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