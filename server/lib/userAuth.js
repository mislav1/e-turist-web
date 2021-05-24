const db = require("../config/database")
const {
    getUnauthorisedErrorResponse
} = require("./utils")

checkToken = () => {

    return (req, res, next) => {

        (async () => {

            const token = req.headers['user-token'];

            if (!token || token.length === 0) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            const queryFindToken = `
            SELECT * FROM AccessToken
            WHERE token = ? and valid = ?
            `
            const [tokens] = await db.query(queryFindToken, {
                replacements: [token, true]
            });

            if (tokens.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            const queryFindUser = `
            SELECT * FROM User
            WHERE id = ?
            `
            const [users] = await db.query(queryFindUser, {
                replacements: [tokens[0].userId]
            });

            if (users.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            req.user = users[0];
            next();

        })();

    }


}

module.exports = checkToken;