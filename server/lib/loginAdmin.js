require('dotenv').config();
const config = require("../config/config");
const { getRandomString } = require("../lib/utils")
const db = require("../config/database")

const invalidateAllAdminTokens = async (adminId) => {

    const queryUpdateAdmin = `
            UPDATE AccessToken
            SET 
                valid = false
            WHERE adminId = ?
        `
    await db.query(queryUpdateAdmin, { replacements: [adminId] });
}

const logoutAdmin = async (adminId) => {

    await invalidateAllAdminTokens(adminId)
}

const loginAdmin = async (adminId) => {

    await invalidateAllAdminTokens(adminId)

    const token = getRandomString(32)

    const queryInsertAccessToken = `
        INSERT INTO AccessToken (token, adminId, userId) VALUES (?, ?, ?)
    `
    await db.query(queryInsertAccessToken, {
        replacements: [
            token,
            adminId,
            null
        ]
    });

    return token;
}

module.exports = {
    loginAdmin,
    invalidateAllAdminTokens,
    logoutAdmin
}