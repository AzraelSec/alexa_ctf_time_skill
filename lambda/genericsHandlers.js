'use stricts'

module.exports.LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log("LaunchHandler started");
        return handlerInput.responseBuilder
        .speak(attrs.t('HELLO_MESSAGE'))
        .getResponse();
    }
};

module.exports.HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log("HelpHandler started");
        return handlerInput.responseBuilder
            .speak(attrs.t('HELP_MESSAGE'))
            .getResponse();
    }
};
  
module.exports.ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log("ExitHandler started");
        return handlerInput.responseBuilder
            .speak(attrs.t('STOP_MESSAGE'))
            .getResponse();
    }
};
  
module.exports.SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

module.exports.ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const attrs = handlerInput.attributesManager.getRequestAttributes();
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak(attrs.t('ERROR_REQUEST_MESSAGE'))
            .getResponse();
    }
};