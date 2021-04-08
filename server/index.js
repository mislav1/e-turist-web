const express = require("express");
const path = require('path');
const fs = require('fs')
const methodOverride = require('method-override');
let adminRoutes = require('./routes/adminRoutes');
let userRoutes = require('./routes/userRoutes');
const db = require("./config/database")
const { httpStatus } = require("./lib/constants")

db.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error))

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.static(path.resolve(__dirname, '../uploads')));

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get('/uploads/*', (req, res) => {
  /*if (fs.existsSync(path.resolve(__dirname, '../uploads', req.url.split('/').pop()))) {
    res.sendFile(path.resolve(__dirname, '../uploads', req.url.split('/').pop()));
  } 
  else {
    res.send({
      status: httpStatus.NotFound,
      error: 'Image not found',
      data: null
    });
  }*/
  res.sendFile(path.resolve(__dirname, '../uploads', req.url.split('/').pop()));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});