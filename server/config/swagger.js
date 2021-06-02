const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, "../../", '.env')
});

const { SWAGGER_SERVER } = process.env

const options = {
    definition: {
        components: {},
        info: {
            title: 'REST API za eTurist aplikaciju', // Title of the documentation
            version: '1.0.0', // Version of the app
            //description: 'This is the REST API for my product', // short description of the app
          },
          host: SWAGGER_SERVER, // the host or url of the app
          basePath: '/api', // the basepath of your endpoint
    },
    apis: [
        "server/routes/**/*.js"
    ]
}

module.exports = options