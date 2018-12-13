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
        /*let slots = handlerInput.requestEnvelope.request.intent.slots;
        let year = slots.year.value ? slots.year.value : null;
        let number =  slots.number.value ? slots.number.value : null*/
        console.log('1');
        return getTopTeams(2018, 5)
        .then((values) => handlerInput.responseBuilder.speak(values).reprompt(values).getResponse())
        .catch(() => handlerInput.responseBuilder.speak(messages.ERROR_MESSAGE).reprompt(messages.ERROR_MESSAGE).getResponse());
    }
}
function getTopTeams(year, teamsNumber) {
    return new Promise((resolve, reject) => {
        let limit = teamsNumber || 10;
        requestTopTeamsSet(year)
        .then((teams) => {
            let speech = new Speech();
            teams = teams.slice(0, limit);
            console.log('Teams' + teams);
            speech.sentence(messages.INFORMATIONS.TOP_TEAMS.START_MESSAGE);;
            for(var i = 0; i < teams.length; i++)
                speech.sentence(`${(i === json_body[year].length - 1) ? ' e ' : ''}${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAMS.TEAM_NAME_SCORE, teams[i].team_name, teams[i].points)}`);
            resolve(speech.ssml(true));
        })
        .catch(() => reject());
    });
}

const GetTopTeamHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'|| (request.type === 'IntentRequest' && request.intent.name === 'GetTopTeam');
    },
    handle(handlerInput) {
        //let year = handlerInput.requestEnvelope.request.intent.slots.year.value ? handlerInput.requestEnvelope.request.intent.slots.year.value : null;
        return getTopTeam(2018)
        .then((value) => handlerInput.responseBuilder.speak(value).reprompt(value).getResponse())
        .catch(() => handlerInput.responseBuilder.speak(messages.ERROR_MESSAGE).reprompt(messages.ERROR_MESSAGE).getResponse());
    }
}
function getTopTeam(year) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            let speech = new Speech();
            speech.sentence(messages.INFORMATIONS.TOP_TEAM.START_MESSAGE);
            speech.sentence(`${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAM.TEAM_NAME_SCORE, teams[0].team_name, teams[0].points)}`);
            resolve(speech.ssml(true));
        })
        .catch(() => reject());
    });
}
function requestTopTeamsSet(year) {
    return new Promise((resolve, reject) => {
        const targetYear = year || (new Date().getFullYear());
        console.log('2');
        //2011: First year documented on CTF Time
        const options = getCTFTimeRequestOptions(endpoints.topEndPoint(targetYear));
        request(options, (err, res, body) => {
            console.log('Fetched data:' + body);
            if(err) reject();
            else resolve(JSON.parse(body).targetYear);
        })
    });
}
function mapTeamNameScore(str, name, score) {
    //parseInt to make it more readable removing floating point stuff
    return `${str.replace('{1}', name).replace('{2}', parseInt(score))}`
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
        }
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