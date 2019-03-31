const cheerio = require("cheerio");
const request = require("request");
//moduls
const Note = require ("../models/Article.js");
const Article = require ("../models/Article.js");
const Save = require("../models/Save.js");

module.exports = function (app){
    app.get ("/scrape", function (req,res){
        request ("https://nytimes.com/", function (error, response, html){
            const $ = cheerio.load(html);
            $("article.story").each(function(i,element){
                const result = {};

                result.summary = $(element).children("p.summary").text();
                result.byline = $(element).children("p.byline").text();
                result.title = $(element).children("h2").text();
                result.link = $(element).children("h2").children("a").attr("href");
                if (result.title && result.link){
                    const entry = new Article(result);
                    Article.update(
                        {link: result.link},
                        result,
                        { upsert: true},
                        function (error, doc){
                            if (error){
                                console.log(error);
                            }
                        }
                    );
                }
            });
            res.json({"code" : "succes"});
        });
    });
    app.get("/articles", function (req, res) {
        Article.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });
    // Get route for  all the articles with the id
    app.get("/articles/:id", function (req, res) {
        Article.find({
                "_id": req.params.id
            })
            .populate("note")
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
    });

    // get route to return all saved articles
    app.get("/saved/all", function (req, res) {
        Save.find({})
            .populate("note")
            .exec(function (error, data) {
                if (error) {
                    console.log(error);
                    res.json({"code" : "error"});
                } else {
                    res.json(data);
                }
            });
    });

    // post route to save the article
    app.post("/save", function (req, res) {
        var result = {};
        result.id = req.body._id;
        result.summary = req.body.summary;
        result.byline = req.body.byline;
        result.title = req.body.title;
        result.link = req.body.link;
        // Save these results in an object that we'll push into the results array we defined earlier
        var entry = new Save(result);
        // Now, save that entry to the db
        entry.save(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
                res.json(err);
            }
            // Or log the doc
            else {
                res.json(doc);
            }
        });
        //res.json(result);
    });

    // route to delete saved articles
    app.delete("/delete", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Save.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            // Log any errors
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            // Or log the doc
            else {
                res.json(doc);
            }
        });
    });

    app.get("/notes/:id", function (req, res) {
        if(req.params.id) {
            Note.find({
                "article_id": req.params.id
            })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
        }
    });


    // Create a new note or replace an existing note
    app.post("/notes", function (req, res) {
        if (req.body) {
            var newNote = new Note(req.body);
            newNote.save(function (error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(doc);
                }
            });
        } else {
            res.send("Error");
        }
    });
    // find and update the note
    app.get("/notepopulate", function (req, res) {
        Note.find({
            "_id": req.params.id
        }, function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });

    // delete a note

    app.delete("/deletenote", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Note.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            // Log any errors
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            // Or log the doc
            else {
                res.json(doc);
            }
        });
    });
}