const express = require("express");
const path = require('path');
const methodOverride = require('method-override');
let adminRoutes = require('./routes/adminRoutes');
let userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});