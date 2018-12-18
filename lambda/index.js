'use stricts'
const Alexa = require('ask-sdk');

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
    generics.FallbackHandler,
    generics.HelpHandler).addErrorHandler(generics.ErrorHandler).lambda();