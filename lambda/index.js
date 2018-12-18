'use stricts'
const Alexa = require('ask-sdk');
const request = require('request');
const Speech = require('ssml-builder');
const messages = require('./assets/strings');
const endpoints = require('./assets/endpoints');

const GetTopTeamsHandler = {
    //Shorthand method declaration
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' || (request.type === 'IntentRequest' && request.intent.name === 'GetTopTeams');
    },
    handle(handlerInput) {
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        let year = (slots.year.value && slots.year.value !== '?') || (new Date().getFullYear());
        let number =  slots.number.value || 10;
        return new Promise((resolve) => {
            getTopTeams(year, number)
            .then((values) => resolve(handlerInput.responseBuilder.speak(values).reprompt(values).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(messages.INFORMATIONS.ERROR_MESSAGE).reprompt(messages.INFORMATIONS.ERROR_MESSAGE).getResponse());
            });
        });
    }
};
function getTopTeams(year, teamsNumber) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log(`Teams received: ${JSON.stringify(teams)}`);
            let speech = new Speech();
            teams = teams.slice(0, teamsNumber);
            speech.sentence(messages.INFORMATIONS.TOP_TEAMS.START_MESSAGE.replace('{1}', teams.length).replace('{2}', year));
            for(var i = 0; i < teams.length; i++)
                speech.sentence(`${(i === teams.length - 1) ? ' e ' : ''}${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAMS.TEAM_NAME_SCORE, teams[i].team_name, teams[i].points)}`);
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}

const GetTopTeamHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'|| (request.type === 'IntentRequest' && request.intent.name === 'GetTopTeam');
    },
    handle(handlerInput) {
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        let year = (slots.year.value && slots.year.value !== '?') || (new Date().getFullYear());
        return new Promise((resolve) => {
            getTopTeam(year)
            .then((value) => resolve(handlerInput.responseBuilder.speak(value).reprompt(value).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(messages.INFORMATIONS.ERROR_MESSAGE).reprompt(messages.INFORMATIONS.ERROR_MESSAGE).getResponse());
            });
        })
            
    }
};
function getTopTeam(year) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log(`Teams received: ${JSON.stringify(teams)}`);
            let speech = new Speech();
            speech.sentence(messages.INFORMATIONS.TOP_TEAM.START_MESSAGE.replace('{1}', year));
            speech.sentence(`${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAM.TEAM_NAME_SCORE, teams[0].team_name, teams[0].points)}`);
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}
function requestTopTeamsSet(year) {
    return new Promise((resolve, reject) => {
        //2011: First year documented on CTF Time
        let presentYear = (new Date().getFullYear());
        if(year === '?' || year < 2011 || year > presentYear) year = presentYear;
        const options = getCTFTimeRequestOptions(endpoints.topEndPoint(year));
        request(options, (err, res, body) => {
            console.log(`Fetched data: ${JSON.stringify(body)}`);
            if(err) reject(err);
            else resolve(body[year]);
        })
    });
}
function mapTeamNameScore(str, name, score) {
    //parseInt to make it more readable removing floating point stuff
    return `${str.replace('{1}', name).replace('{2}', parseInt(score))}`
}

const GetNextEvents = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' || ( request.type === 'IntentRequest' && request.intent.name === 'GetNextEvents');
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
        let options = getCTFTimeRequestOptions(endpoints.eventsEndPoint());
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

const HelpHandler = {
    canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.HELP_MESSAGE)
      .reprompt(messages.HELP_REPROMPT)
      .getResponse();
  }
};

const FallbackHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(messages.FALLBACK_MESSAGE)
        .reprompt(messages.FALLBACK_REPROMPT)
        .getResponse();
    }
  };
  
const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(messages.STOP_MESSAGE)
        .getResponse();
    }
};
  
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak(messages.ERROR_REQUEST_MESSAGE)
            .reprompt(messages.ERROR_REQUEST_MESSAGE)
            .getResponse();
    }
};

function getCTFTimeRequestOptions(endpoint) {
    return {
        url: endpoint,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'Alexa\'s CTF Time Skill'
        },
        json: true
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder.addRequestHandlers(
    GetTopTeamsHandler,
    GetTopTeamHandler,
    GetNextEvents,
    SessionEndedRequestHandler,
    ExitHandler,
    FallbackHandler,
    HelpHandler).addErrorHandler(ErrorHandler).lambda();