'use stricts'
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const itLocal = require('./assets/locales/it');
const enLocal = require('./assets/locales/en');

const locales = {
    it: itLocal,
    en: enLocal    
}

module.exports = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: locales,
            returnObjects: true,
            debug: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
}