'use stricts'
module.exports.getCTFTimeRequestOptions = function (endpoint) {
    return {
        url: endpoint,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'Alexa\'s CTF Time Skill'
        },
        json: true
    }
};