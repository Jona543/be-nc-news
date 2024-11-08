const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const endpoints = require("./endpoints.json");
const {
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postCommentsByArticle,
  patchVotesByArticle,
} = require("./controllers/articles-controllers");
const { deleteComment } = require("./controllers/comments-controllers");
const { getUsers } = require("./controllers/users-controllers");
const { psqlErrorHandler, customErrorHandler } = require("./error-handlers");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postCommentsByArticle);

app.patch("/api/articles/:article_id", patchVotesByArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

module.exports = app;
