exports.isValidDate = (dateString) => {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

const CognitoExpress = require("cognito-express")

exports.validateToken = async (token) => {
    const cognitoExpress = new CognitoExpress({
        region: process.env.region,
        cognitoUserPoolId: process.env.cognitoUserPoolId,
        tokenUse: process.env.tokenUse, //Possible Values: access | id
        tokenExpiration: parseInt(process.env.tokenExpiration) //Up to default expiration of 1 hour (3600000 ms)
    })

    try {
        let tokenPayload = await cognitoExpress.validate(token)

        return tokenPayload
    } catch (e) {
        throw new Error(e);
    }
}