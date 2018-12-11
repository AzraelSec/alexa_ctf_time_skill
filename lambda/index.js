'use stricts'
const Alexa = require('ask-sdk');
const request = require('request');
var Speech = require('ssml-builder');

/*
    MESSAGES
*/
const SKILL_NAME = 'ctf time';
const HELP_MESSAGE = 'Puoi chiedermi informazioni sulle classifiche su ctf time, quali siano i prossimi eventi, e altro';
const HELP_REPROMPT = 'In cosa posso aiutarti?';
const ERROR_MESSAGE = 'Al momento non riesco a cercare le informazioni, riprova più tardi';
const FALLBACK_MESSAGE = 'Mi dispiace, ma CTF Time non può aiutarti in questo. Posso aiutarti in qualcos\'altro?';
const FALLBACK_REPROMPT = 'In cosa posso aiutarti?';
const STOP_MESSAGE = 'Ciao!';

const INFORMATIONS = {
    TOP_TEAMS: {
        START_MESSAGE: 'I migliori dieci team quest\'anno sono i seguenti:',
        TEAM_NAME_SCORE: '{1} con {2} punti'
    },
    TOP_TEAM: {
        START_MESSAGE: 'Il miglior team quest\'anno è ',
        TEAM_NAME_SCORE: '{1} con {2} punti'
    }
};
/*
    END_MESSAGES
*/


const GetTopTeamsHandler = {
    //Shorthand method declaration
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' || (request.type === 'IntentRequest' && request.intent.name === 'GetTopTeams');
    },
    handle(handlerInput) {
        return getTopTeams()
            .then((values) => handlerInput.responseBuilder.speak(values).reprompt(values).getResponse())
            .catch(() => handlerInput.responseBuilder.speak(ERROR_MESSAGE).reprompt(ERROR_MESSAGE).getResponse())
    }
}
function getTopTeams() {
    return new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const options = {
            url: `https://ctftime.org/api/v1/top/${encodeURIComponent(year)}/`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'Alexa\'s CTF Time Skill'
            }
        }
        request(options, (err, res, body) => {
            if(err) reject();
            else {
                var speech = new Speech();
                speech.sentence(INFORMATIONS.TOP_TEAMS.START_MESSAGE);
                var json_body = JSON.parse(body);
                for(var i = 0; i < json_body[year].length; i++)
                    speech.sentence(`${(i === json_body[year].length - 1) ? ' e ' : ''}${mapTeamNameScore(INFORMATIONS.TOP_TEAMS.TEAM_NAME_SCORE, json_body[year][i].team_name, json_body[year][i].points)}`);
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
        return getTopTeams
    }
}
function getTopTeams() {
    return new Promise((resolve, reject) => {
        const year = new Date().getFullYear();
        const options = {
            url: `https://ctftime.org/api/v1/top/${encodeURIComponent(year)}/`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'Alexa\'s CTF Time Skill'
            }
        }
        request(options, (err, res, body) => {
            if(err) reject();
            else {
                var speech = new Speech();
                speech.sentence(INFORMATIONS.TOP_TEAM.START_MESSAGE);
                var json_body = JSON.parse(body);
                speech.sentence(`${mapTeamNameScore(INFORMATIONS.TOP_TEAM.TEAM_NAME_SCORE, json_body[year][0].team_name, json_body[year][0].points)}`);
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
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(FALLBACK_MESSAGE)
        .reprompt(FALLBACK_REPROMPT)
        .getResponse();
    },
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
        .speak(STOP_MESSAGE)
        .getResponse();
    },
  };
  
  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
  
      return handlerInput.responseBuilder.getResponse();
    },
  };
  
  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, an error occurred.')
        .reprompt('Sorry, an error occurred.')
        .getResponse();
    },
  };  

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder.addRequestHandlers(
    GetTopTeamsHandler,
    SessionEndedRequestHandler,
    ExitHandler,
    FallbackHandler,
    HelpHandler).addErrorHandler(ErrorHandler).lambda();