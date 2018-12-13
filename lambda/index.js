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
        return getTopTeams()
            .then((values) => handlerInput.responseBuilder.speak(values).reprompt(values).getResponse())
            .catch(() => handlerInput.responseBuilder.speak(messages.ERROR_MESSAGE).reprompt(messages.ERROR_MESSAGE).getResponse());
    }
}
function getTopTeams() {
    return new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const options = getCTFTimeRequestOptions(endpoints.topEndPoint(year));
        request(options, (err, res, body) => {
            if(err) reject();
            else {
                var speech = new Speech();
                speech.sentence(messages.INFORMATIONS.TOP_TEAMS.START_MESSAGE);
                var json_body = JSON.parse(body);
                for(var i = 0; i < json_body[year].length; i++)
                    speech.sentence(`${(i === json_body[year].length - 1) ? ' e ' : ''}${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAMS.TEAM_NAME_SCORE, json_body[year][i].team_name, json_body[year][i].points)}`);
                resolve(speech.ssml(true));
            }
        })
    });
}

const GetTopTeamHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'|| (request.type === 'IntentRequest' && request.intent.name === 'GetTopTeam');
    },
    handle(handlerInput) {
        return getTopTeam()
        .then((value) => handlerInput.responseBuilder.speak(value).reprompt(value).getResponse())
        .catch(() => handlerInput.responseBuilder.speak(messages.ERROR_MESSAGE).reprompt(messages.ERROR_MESSAGE).getResponse());
    }
}
function getTopTeam() {
    return new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const options = getCTFTimeRequestOptions(endpoints.topEndPoint(year));
        request(options, (err, res, body) => {
            if(err) reject();
            else {
                var speech = new Speech();
                speech.sentence(messages.INFORMATIONS.TOP_TEAM.START_MESSAGE);
                var json_body = JSON.parse(body);
                speech.sentence(`${mapTeamNameScore(messages.INFORMATIONS.TOP_TEAM.TEAM_NAME_SCORE, json_body[year][0].team_name, json_body[year][0].points)}`);
                resolve(speech.ssml(true));
            }
        })
    });
}
function mapTeamNameScore(str, name, score) {
    return `${str.replace('{1}', name).replace('{2}', score)}`
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