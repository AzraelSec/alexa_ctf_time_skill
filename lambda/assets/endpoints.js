module.exports = {
    BASE_URI = 'https://ctftime.org/api/v1',
    topEndPoint(year) {
        return `${BASE_URI}${year ? `${year}/` : '/'}`;
    }
};