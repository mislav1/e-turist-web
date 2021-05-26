require('dotenv').config();
const config = require("../config/config");
const path = require("path");
const fs = require("fs");
const { maxFileSize, allowedExtensions, httpStatus } = require("../lib/constants")
const { transporter } = require("../config/nodemailer")

const parseFileRequest = async (request) => {
    const fields = request.fields;
    let files;
    if (Array.isArray(request.files.files)) {
        files = request.files.files;
    } else if (request.files.files) {
        files = [request.files.files]
    } else {
        files = []
    }

    const newBody = {};

    Object.keys(fields).map((key) => {
        const res = /^(.+)\[(.+)\]$/.exec(key);

        if (res && res.length && res.length > 1) {
            const paramName = res[1];

            if (!newBody[paramName]) newBody[paramName] = [];

            newBody[paramName].push(fields[key]);
        } else {
            newBody[key] = fields[key];
        }
    });

    Object.keys(files).map((key) => {
        const res = ["files", key];

        if (res && res.length && res.length > 1) {
            const paramName = res[0];

            if (!newBody[paramName]) newBody[paramName] = [];

            newBody[paramName].push(files[key]);
        }
    });

    if (files.length > 1) {
        newBody.error = "Dozvoljen broj datoteka za upload je 1!";
        return newBody;
    }

    // copy files to uploads dir
    Object.keys(newBody).map((key) => {
        const param = newBody[key];

        if (typeof param == "object" && param.map) {
            newBody[key] = param.map((file) => {

                if (file && file.size) {
                    const ext = "." + file.name.split('.').pop()

                    if (file && file.size > maxFileSize) {
                        newBody.error = "Maksimalna veličina datoteke 10MB!";
                        return;
                    } else if (!allowedExtensions.includes(ext)) {
                        newBody.error = "Ekstenzija datoteke nije podržana!";
                        return;
                    }

                    const newFileName = getRandomString(15) + "_" + ext;
                    const newPath = path.join(__dirname, "../../", config.uploadsFolder) + "/" + newFileName;

                    if (!fs.existsSync(path.join(__dirname, "../../", config.uploadsFolder))) {
                        fs.mkdirSync(path.join(__dirname, "../../", config.uploadsFolder))
                    }

                    fs.copyFileSync(file.path, newPath);

                    const localFilename = newFileName;

                    return {
                        size: file.size,
                        name: file.name,
                        type: file.type,
                        localFilename: localFilename,
                    };
                } else {
                    return file;
                }
            });
        } else {
            return param;
        }
    });

    return newBody;
}

const getRandomString = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    if (!length) {
        length = 32;
    }

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const getSuccessResponse = (data) => {
    return {
        status: httpStatus.Success,
        error: null,
        data
    }
}

const getBadRequestResponse = (error) => {
    return {
        status: httpStatus.BadRequest,
        error,
        data: null
    }
}

const getInternalServerErrorResponse = (error) => {
    return {
        status: httpStatus.InternalServerError,
        error,
        data: null
    }
}

const getNotFoundErrorResponse = (error) => {
    return {
        status: httpStatus.NotFound,
        error,
        data: null
    }
}

const getUnauthorisedErrorResponse = (error) => {
    return {
        status: httpStatus.Unauthorized,
        error,
        data: null
    }
}

const getRegistrationFormError = (email, password) => {

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return "Email adresa nije valjana!"
    } else if (!/^(?=.*?[0-9])(?=.*[+!\-#$@]).{6,}$/.test(password)) {
        return "Lozinka mora sadržavati najmanje 6 znakova, barem jedan broj i barem jedan posebni znak (+,-,!,#,$,@)"
    }

    return ''
}

const getPasswordError = (password) => {

    if (!/^(?=.*?[0-9])(?=.*[+!\-#$@]).{6,}$/.test(password)) {
        return "Lozinka mora sadržavati najmanje 6 znakova, barem jedan broj i barem jedan posebni znak (+,-,!,#,$,@)"
    }

    return ''
}

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error({ message: error })
        } else {
            console.log('Email sent: ' + info.response);
          }
    })
}

const isIntegerBetween = (number, min, max) => {
    try {
        parseInt(number)
        if (number < min || number > max) return false
    } catch (error) {
        return false
    }

    return true
}

module.exports = {
    getRandomString,
    parseFileRequest,
    getSuccessResponse,
    getBadRequestResponse,
    getInternalServerErrorResponse,
    getRegistrationFormError,
    sendEmail,
    getNotFoundErrorResponse,
    getUnauthorisedErrorResponse,
    getPasswordError,
    isIntegerBetween
}