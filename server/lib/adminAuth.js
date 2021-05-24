const db = require("../config/database")
const {
    getUnauthorisedErrorResponse
} = require("./utils")

checkToken = () => {

    return (req, res, next) => {

        (async () => {

            const token = req.headers['token'];

            if (!token || token.length === 0) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            const queryFindToken = `
            SELECT * FROM AccessToken
            WHERE token = ?  and valid = ?
            `
            const [tokens] = await db.query(queryFindToken, {
                replacements: [token, true]
            });

            if (tokens.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            const queryFindAdmin = `
            SELECT * FROM Administrator
            WHERE id = ?
            `
            const [admins] = await db.query(queryFindAdmin, {
                replacements: [tokens[0].adminId]
            });

            if (admins.length !== 1) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
            }

            req.admin = admins[0];
            next();

        })();

    }


}

module.exports = checkToken;