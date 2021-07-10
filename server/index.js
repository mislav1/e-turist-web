const express = require("express");
const path = require('path');
const fs = require('fs')
const methodOverride = require('method-override');
let adminRoutes = require('./routes/adminRoutes');
let userRoutes = require('./routes/userRoutes');
const db = require("./config/database")
const { httpStatus } = require("./lib/constants")
const cors = require("cors")
const options = require("./config/swagger")
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

db.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error))

const specs = swaggerJsDoc(options)

const app = express();
app.use("/documentation", swaggerUI.serve, swaggerUI.setup(specs))
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.use(cors())

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.static(path.resolve(__dirname, '../uploads')));

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get('/uploads/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../uploads', req.url.split('/').pop()));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = server