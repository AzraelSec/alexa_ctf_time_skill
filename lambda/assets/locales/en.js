
'use strict'
module.exports = {
    translation: {
        SKILL_NAME: 'ctf time',
        HELLO_MESSAGE: '<emphasis>ctf time</emphasis> is ready',
        HELP_MESSAGE: 'You can ask me information about ctf time\'s rankings, about the upcoming events, and more',
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
            }
        }
    }
};