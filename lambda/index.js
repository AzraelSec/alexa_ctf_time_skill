'use stricts'
const Alexa = require('ask-sdk');
const LocalizationInterceptor = require('./localizationInterceptor');

const generics = require('./genericsHandlers');
const rankings = require('./rankingsHandlers');
const events = require('./eventsHandlers');

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder.addRequestHandlers(
    rankings.GetTopTeamsHandler,
    rankings.GetTopTeamHandler,
    events.GetNextEvents,
    generics.SessionEndedRequestHandler,
    generics.ExitHandler,
    generics.HelpHandler,
    generics.LaunchHandler).addRequestInterceptors(LocalizationInterceptor).addErrorHandler(generics.ErrorHandler).lambda();