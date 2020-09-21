const { articleData, commentData } = require("../data/test-data");

const articlesFormatter = (articlesData) => {
  return articlesData.map((article) => {
    const articleCopy = { ...article };
    const unixTime = articleCopy.created_at;
    const date = new Date(unixTime);
    articleCopy.created_at = date;
    return articleCopy;
  });
};

const makeArticleRef = (unformattedArticles) => {
  const refObj = {};
  unformattedArticles.forEach((article) => {
    refObj[article.title] = article.article_id;
    console.log(refObj);
  });
  return refObj;
};

const commentsFormatter = (commentData, insertedArticles) => {
  const artiRef = makeArticleRef(insertedArticles);
  return commentData.map((comment) => {
    const commentCopy = { ...comment };
    const date = new Date(comment.created_at);
    commentCopy.created_at = date;
    commentCopy.article_id = artiRef[comment.belongs_to];
    delete commentCopy.belongs_to;
    return commentCopy;
  });
};

module.exports = { articlesFormatter, commentsFormatter };

// extract any functions you are using to manipulate your data, into this file
