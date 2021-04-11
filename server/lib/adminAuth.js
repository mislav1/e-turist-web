const db = require("../config/database")
const {
    getUnauthorisedErrorResponse
} = require("./utils")

checkToken = () => {

    return (req, res, next) => {

        (async () => {

            const token = req.headers['token'];

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

            const queryFindAdmin = `
            SELECT * FROM Administrator
            WHERE id = ?
            `
            const [admins] = await db.query(queryFindAdmin, {
                replacements: [tokens[0].adminId]
            });

            if (admins.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Unauthorised!"))
            }

            req.admin = admins[0];
            next();

        })();

    }


}

module.exports = checkToken;