const db = require("../config/database")
const {
    getUnauthorisedErrorResponse
} = require("./utils")

checkToken = () => {

    return (request, response, next) => {

        (async () => {

            const token = request.headers['user-token'];

            if (!token || token.length === 0) {
                return res.send(getUnauthorisedErrorResponse("Unauthorised!"))
            }

            const queryFindToken = `
            SELECT * FROM AccessToken
            WHERE token = ?
            `
            const [tokens] = await db.query(queryFindToken, {
                replacements: [token]
            });

            if (tokens.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Unauthorised!"))
            }

            const queryFindUser = `
            SELECT * FROM User
            WHERE id = ?
            `
            const [users] = await db.query(queryFindUser, {
                replacements: [tokens[0].userId]
            });

            if (users.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Unauthorised!"))
            }

            request.user = users[0];
            next();

        })();

    }


}

module.exports = checkToken;