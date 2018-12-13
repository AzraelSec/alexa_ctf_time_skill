const BASE_URI = 'https://ctftime.org/api/v1';

module.exports = {
    topEndPoint: function (year) {
        let endpoint = `${BASE_URI}/top${year ? '/'+ year +'/' : '/'}`;
        console.log(`Request to API: ${endpoint}`);
        return endpoint;
    }
}