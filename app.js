const express = require('express');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

require("./config.js");
const multer = require('multer');
const path = require("path");
const routes = require('./routes.js');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT ||5000;
app.get('/', (req, res) => {
    
    res.send("Welcome to our Todo App");
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// const routes = require('./routes');
app.use(routes)
