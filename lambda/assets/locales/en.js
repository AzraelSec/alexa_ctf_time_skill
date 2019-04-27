'use strict'
module.exports = {
    translation: {
        SKILL_NAME: 'c. t. f. time',
        HELLO_MESSAGE: 'Welcome to Sfide C. T. F. ! Ask me information about upcoming cybersecurity challanges or about teams rankings',
        HELP_MESSAGE: 'You can ask me information about c. t. f. time\'s rankings, about the upcoming events, and more',
        HELP_REPROMPT: 'What can I help you with?',
        ERROR_MESSAGE: 'I cannot load information at the moment, retry later',
        ERROR_REQUEST_MESSAGE : 'I am sorry, I am not sure I understood. Try to rephrase your question!',
        STOP_MESSAGE : 'Bye, see you soon!',
        CONJUNCTION: ' and ',
        INFORMATIONS : {
            TOP_TEAMS: {
                START_MESSAGE: 'The best %s teams of %d are the following:',
                TEAM_NAME_SCORE: '%s with %d points'
            },
            TOP_TEAM: {
                START_MESSAGE: 'The best team of %d is',
                TEAM_NAME_SCORE: '%s with %d points'
            },
            NEXT_EVENTS: {
                START_MESSAGE: 'The next %d events are the following:',
                EVENT_DESCRIPTION: '%s, %s type, which starts on %s and lasts for %d hours'
            },
            NEXT_EVENT: {
                START_MESSAGE: 'The next event is:',
                EVENT_DESCRIPTION: '%s, %s type, which starts on %s and lasts for %d hours'
            }
        }
    }
};