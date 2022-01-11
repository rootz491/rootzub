const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { isAuthenticated, isSubscribed } = require("./middlewares/auth");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.use('/api/subscription/webhook', bodyParser.raw({type: "*/*"}));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', isAuthenticated, require('./routes/user'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/secured', isAuthenticated, isSubscribed, require('./routes/secured'));

app.use('*', (req, res) => {
    res.status(404).send('Not Found');
})

app.listen(process.env.PORT || 1337, () => {
    console.log("Server is running at http://localhost:1337");
});