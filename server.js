const express = require("express");
const bodyparser = require("body-parser");
const request = require ("request");
const mongoose = require("mongoose");
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
const Save = require ("./models/Save.js");
const logger = require("morgan");
const cheerio = require("cheerio");
const path = require ("path");
const app = express();
const PORT = Process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("./public"));

// connect to database
mongoose.Promise = Promise;
var dbConnect = process.env.MONGODB_URI || "mongodb://localhost/foxsScrape";
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(dbConnect);
}
// mongodb://foxsScrape:password12@ds119585.mlab.com:19585/heroku_hd8909ql;
// Connect mongoose to our database
/* mongoose.connect(dbConnect, function (error) {
    // Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log a success message
    else {
        console.log("Mongoose connection is successful");
    }
}); */
var db = mongoose.connection;
db.on('error',function(err){
    console.log('Mongoose Error',err);
});
db.once('open', function(){
    console.log("Mongoose connection is successful");
});
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});