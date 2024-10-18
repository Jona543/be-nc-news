const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticle,
  insertComment,
  editVotesByArticle,
} = require("../models/articles-models");
const { fetchUsers } = require("../models/users-models");
const { fetchTopics } = require("../models/topics-models");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  const userQuery = request.query;
  fetchTopics()
    .then((topics) => {
      return fetchArticles(userQuery, topics);
    })
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then(() => {
      return fetchCommentsByArticle(article_id);
    })
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentsByArticle = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;
  fetchUsers()
    .then((users) => {
      return insertComment(article_id, username, body, users);
    })
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchVotesByArticle = (request, response, next) => {
  const { body } = request;
  const { article_id } = request.params;
  editVotesByArticle(article_id, body)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postCommentsByArticle,
  patchVotesByArticle,
};
