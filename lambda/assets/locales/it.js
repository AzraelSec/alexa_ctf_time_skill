'use strict'
module.exports = {
    it: {
        translation: {
            SKILL_NAME: 'ctf time',
            HELLO_MESSAGE: '<emphasis>ctf time</emphasis> è pronto',
            HELP_MESSAGE: 'Puoi chiedermi informazioni sulle classifiche su ctf time, quali siano i prossimi eventi, e altro',
            HELP_REPROMPT: 'In cosa posso aiutarti?',
            ERROR_MESSAGE: 'Al momento non riesco a cercare le informazioni, riprova più tardi',
            ERROR_REQUEST_MESSAGE : 'Mi dispiace, non riesco a gestire la tua richiesta. Prova a riformulare la domanda!',
            STOP_MESSAGE : 'Ciao, alla prossima!',
        
            INFORMATIONS : {
                TOP_TEAMS: {
                    START_MESSAGE: 'I migliori %s team del %d sono i seguenti:',
                    TEAM_NAME_SCORE: '%s con %d punti'
                },
                TOP_TEAM: {
                    START_MESSAGE: 'Il miglior team del %d è:',
                    TEAM_NAME_SCORE: '%s con %d punti'
                },
                NEXT_EVENTS: {
                    START_MESSAGE: 'I prossimi %d eventi sono i seguenti:',
                    EVENT_DESCRIPTION: '%s, di tipo %s, che inizia il %s e dura %d ore'
                }
            }
        }
    }
};