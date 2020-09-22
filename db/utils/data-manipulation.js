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

    //foreach insertedArticle
    //sets refObj key to article title, value is set to article_id
    // console.log(refObj);
  });
  // console.log(refObj); {the vegan carnivore? :36}
  return refObj;
};

const commentsFormatter = (commentData, insertedArticles) => {
  const artiRef = makeArticleRef(insertedArticles);

  return commentData.map((comment) => {
    const commentCopy = { ...comment };
    const date = new Date(comment.created_at);
    commentCopy.created_at = date;

    commentCopy.article_id = artiRef[comment.belongs_to];
    commentCopy.author = commentCopy.created_by; //accessing the article title from the ref obj (belongs_to on the comments obj), sets the value as article id, saved to the key of article_id

    delete commentCopy.created_by;
    delete commentCopy.belongs_to;

    return commentCopy;
  });
};

module.exports = { articlesFormatter, commentsFormatter };

// extract any functions you are using to manipulate your data, into this file
