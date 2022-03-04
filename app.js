const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// const article = new Article({
//   title: "REST",
//   content:
//     "REST is representational state transfer. It is gold standard for creating APIs",
// });
// Article.insertMany(article ,function(err){
//     if(err) console.log(err);
//     else
//     console.log("Data Added successfully");
// })

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) res.send(err);
      else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save();
    res.send("Successfully posted to database");
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) res.send(err);
      else res.send("Successfully deleted all articles");
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.find(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle.length) res.send(foundArticle);
        else res.send("No Matching article found");
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (err) res.send(err);
        else res.send("Successfully updated article");
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (err) res.send(err);
        else res.send("Successfully patched the article");
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) res.send(err);
      else res.send("Successfully deleted the article");
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
