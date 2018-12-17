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
        let year = slots.year.value ? slots.year.value : null;
        let number =  slots.number.value ? slots.number.value : null
        return new Promise((resolve) => {
            getTopTeams(year, number)
            .then((values) => resolve(handlerInput.responseBuilder.speak(values).reprompt(values).getResponse()))
            .catch((e) => resolve(handlerInput.responseBuilder.speak(e.message).reprompt(e.message).getResponse()))
        });
    }
};
function getTopTeams(year, teamsNumber) {
    return new Promise((resolve, reject) => {
        let limit = teamsNumber || 10;
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log("Teams received: " + JSON.stringify(teams));
            let speech = new Speech();
            teams = teams.slice(0, limit);
            console.log('Teams' + teams);
            speech.sentence(messages.INFORMATIONS.TOP_TEAMS.START_MESSAGE.replace('{1}', teams.length).replace('{2}', year));;
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
        let year = handlerInput.requestEnvelope.request.intent.slots.year.value ? handlerInput.requestEnvelope.request.intent.slots.year.value : null;
        return getTopTeam(year)
        .then((value) => handlerInput.responseBuilder.speak(value).reprompt(value).getResponse())
        .catch(() => handlerInput.responseBuilder.speak(e.message).reprompt(e.message).getResponse());
    }
};
function getTopTeam(year) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log("Teams received: " + JSON.stringify(teams));
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
        let targetYear = year || (new Date().getFullYear());
        //to fix misunderstanding errors
        if(targetYear === '?') targetYear = (new Date().getFullYear());
        //2011: First year documented on CTF Time
        const options = getCTFTimeRequestOptions(endpoints.topEndPoint(targetYear));
        request(options, (err, res, body) => {
            console.log('Fetched data:' + JSON.stringify(body));
            if(err) reject(err);
            else resolve(body[targetYear]);
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
        
    }
};
function requestNextEventsSet(startDate, endDate, number) {
    return new Promise((resolve, reject) => {
        //UNIX timestamp adjusting...
        let targetStartDate = startDate || (new Date().getTime() / 1000);
        if(targetStartDate === '?') targetStartDate = (new Date().getTime() / 1000);
        let options = getCTFTimeRequestOptions(endpoints.eventsEndPoint());
        //GET request query sting's parameters
        options.qs = {};
        if(targetStartDate) options['start'] = targetStartDate;
        if(number) options['limit'] = number || 5;
        request(options, (err, res, body) => {
            console.log('Fetched data:' + JSON.stringify(body));
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
    SessionEndedRequestHandler,
    ExitHandler,
    FallbackHandler,
    HelpHandler).addErrorHandler(ErrorHandler).lambda();