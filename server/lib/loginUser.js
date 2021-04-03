require('dotenv').config();
const config = require("../config/config");
const { getRandomString } = require("../lib/utils")
const db = require("../config/database")

const loginUser = async (user) => {

    const token = getRandomString(32)

    const queryUpdateUser = `
            UPDATE User
            SET 
                validationCode = null,
                isValidated = true
        `
    await db.query(queryUpdateUser);

    const queryInsertAccessToken = `
        INSERT INTO AccessToken (token, userId, adminId) VALUES (?, ?, ?)
    `
    await db.query(queryInsertAccessToken, {
        replacements: [
            token,
            user.id,
            null
        ]
    });

    return token;
}

module.exports = {
    loginUser
}