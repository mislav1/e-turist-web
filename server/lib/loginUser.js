require('dotenv').config();
const config = require("../config/config");
const { getRandomString } = require("../lib/utils")
const db = require("../config/database")

const invalidateAllUserTokens = async (userId) => {

    const queryUpdateUser = `
            UPDATE AccessToken
            SET 
                valid = false
            WHERE userId = ?
        `
    await db.query(queryUpdateUser, { replacements: [userId] });
}

const logoutUser = async (userId) => {

    await invalidateAllUserTokens(userId)
}

const loginUser = async (userId) => {

    await invalidateAllUserTokens(userId)

    const token = getRandomString(32)

    const queryUpdateUser = `
            UPDATE User
            SET 
                validationCode = null,
                isValidated = true
            WHERE id = ?
        `
    await db.query(queryUpdateUser, { replacements: [userId] });

    const queryInsertAccessToken = `
        INSERT INTO AccessToken (token, userId, adminId) VALUES (?, ?, ?)
    `
    await db.query(queryInsertAccessToken, {
        replacements: [
            token,
            userId,
            null
        ]
    });

    return token;
}

module.exports = {
    loginUser,
    invalidateAllUserTokens,
    logoutUser
}