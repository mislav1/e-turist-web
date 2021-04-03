const config = require("../config/config");
const path = require("path");
const fs = require("fs");
const { maxFileSize, allowedExtensions } = require("../lib/constants")

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
        newBody.error = "Max number of allowed files to upload is 1!";
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
                        newBody.error = "Max upload size is 10MB!";
                        return;
                    } else if (!allowedExtensions.includes(ext)) {
                        newBody.error = "Unsupported File Extension!";
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

module.exports = {
    getRandomString,
    parseFileRequest
}