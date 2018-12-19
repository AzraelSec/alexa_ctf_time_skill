'use stricts'
const helpers = require('./helpers');
const request = require('request');
const Speech = require('ssml-builder');

const endpoints = require('./assets/endpoints');

module.exports.GetTopTeamsHandler = {
    //Shorthand method declaration
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetTopTeams';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        let year = (slots.year.value && slots.year.value !== '?' ? slots.year.value : null) || (new Date().getFullYear());
        let number =  slots.number.value || 10;
        return new Promise((resolve) => {
            getTopTeams(attrs, year, number)
            .then((values) => resolve(handlerInput.responseBuilder.speak(values).reprompt(values).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(attrs.t('INFORMATIONS.ERROR_MESSAGE')).reprompt(attrs.t('INFORMATIONS.ERROR_MESSAGE')).getResponse());
            });
        });
    }
};
function getTopTeams(attrs, year, teamsNumber) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log(`Teams received: ${JSON.stringify(teams)}`);
            let speech = new Speech();
            teams = teams.slice(0, teamsNumber);
            speech.sentence(attrs.t('INFORMATIONS.TOP_TEAMS.START_MESSAGE', teams.length, year));
            for(var i = 0; i < teams.length; i++)
            {
                let and = i === teams.length - 1;
                speech.sentence(`${and ? attrs.t('CONJUNCTION') : ''}${attrs.t('INFORMATIONS.TOP_TEAMS.TEAM_NAME_SCORE', teams[i].team_name, parseInt(teams[i].points))}`);
            }
            resolve(speech.ssml(true));
        })
        .catch((e) => reject(e));
    });
}

module.exports.GetTopTeamHandler = {
    canHandle(handlerInput) {
        let request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'GetTopTeam';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        let year = (slots.year.value && slots.year.value !== '?' ? slots.year.value : null) || (new Date().getFullYear());
        return new Promise((resolve) => {
            getTopTeam(attrs, year)
            .then((value) => resolve(handlerInput.responseBuilder.speak(value).reprompt(value).getResponse()))
            .catch((e) => {
                console.log(`Error: ${e.message}`);
                resolve(handlerInput.responseBuilder.speak(attrs.t('INFORMATIONS.ERROR_MESSAGE')).reprompt(attrs.t('INFORMATIONS.ERROR_MESSAGE')).getResponse());
            });
        })
            
    }
};
function getTopTeam(attrs, year) {
    return new Promise((resolve, reject) => {
        requestTopTeamsSet(year)
        .then((teams) => {
            console.log(`Teams received: ${JSON.stringify(teams)}`);
            let speech = new Speech();
            speech.sentence(attrs.t('INFORMATIONS.TOP_TEAM.START_MESSAGE', year));
            speech.sentence(`${attrs.t('INFORMATIONS.TOP_TEAM.TEAM_NAME_SCORE', teams[0].team_name, parseInt(teams[0].points))}`);
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
        const options = helpers.getCTFTimeRequestOptions(endpoints.topEndPoint(year));
        request(options, (err, res, body) => {
            console.log(`Fetched data: ${JSON.stringify(body)}`);
            if(err) reject(err);
            else resolve(body[year]);
        })
    });
}