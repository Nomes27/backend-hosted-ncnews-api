\c nc_news_test


SELECT articles.article_id, title, articles.votes, topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id;



--group by gets rid of all duplicate article ids, so only 1 of each--
--LEFT JOIN because not all articles have comments, standard would be an inner join but that is no good here as it gets all data at the intersection between articles and comments, but we want to include the articles that don't have comments too, so need a left join