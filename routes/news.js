var express = require('express');
var database = require('../config/db_connection');
var router = express.Router();

// Route to display all news
router.get('/all', function (request, response) {
    if (database != null) {
        database.query('SELECT * FROM news', function (error, results) {
            if (!error) {
                response.render('news-all', { newsList: results });
            }
        });
    }
});

// Route to display the form for creating news
router.get('/create', function (request, response) {
    if (database != null) {
        database.query('SELECT * FROM topic', function (error, topicList) {
            database.query('SELECT * FROM sub_topic', function (error, subTopicList) {
                response.render('create-news', { topics: topicList, subTopics: subTopicList, message: request.flash('message') });
            });
        });
    }
});

// Route to handle form submission for news creation
router.post('/post-form', function (request, response) {
    var news = {
        title: request.body.title,
        sub_title: request.body.sub_title,
        news_source: request.body.news_source,
        news_detail: request.body.news_detail,
        video_link: request.body.video_link,
        news_photo: "",
        sub_topic_id: request.body.sub_topic_id,
        topic_id: request.body.topic_id,
        is_featured: request.body.is_featured ? true : false,
        is_top_story: request.body.is_top_story ? true : false,
        is_video: request.body.is_video ? true : false,
        is_video_of_the_day: request.body.is_video_of_the_day ? true : false,
    };

    if (request.files) {
        var file = request.files.newsPhoto;
        var fileName = file.name;
        file.mv('./uploads/' + fileName, function (error) {
            if (!error) {
                news.news_photo = "/" + fileName;
                if (database != null) {
                    database.query('INSERT INTO news SET ?', news, function (error, result) {
                        if (!error) {
                            request.flash('message', 'News inserted successfully!');
                            response.redirect('/news/create');
                        } else {
                            response.send(error);
                        }
                    });
                }
            } else {
                response.send(error);
            }
        });
    }
});

// Route to edit a specific news item
router.get('/edit/:id', function (request, response) {
    if (database != null) {
        database.query("SELECT * FROM news WHERE id = ?", request.params.id, function (error, news) {
            database.query('SELECT * FROM topic', function (err, topicList) {
                database.query('SELECT * FROM sub_topic', function (err, subTopicList) {
                    response.render('news-edit', { news: news[0], topics: topicList, subTopics: subTopicList, message: request.flash('message') });
                });
            });
        });
    }
});

// Route to handle updating a news item
router.post('/update-form/:id', function (request, response) {
    var news = {
        title: request.body.title,
        sub_title: request.body.sub_title,
        news_source: request.body.news_source,
        news_detail: request.body.news_detail,
        video_link: request.body.video_link,
        news_photo: "",
        sub_topic_id: request.body.sub_topic_id,
        topic_id: request.body.topic_id,
        is_featured: request.body.is_featured ? true : false,
        is_top_story: request.body.is_top_story ? true : false,
        is_video: request.body.is_video ? true : false,
        is_video_of_the_day: request.body.is_video_of_the_day ? true : false,
        id: request.params.id
    };

    if (request.files) {
        var file = request.files.newsPhoto;
        var fileName = file.name;
        file.mv('./uploads/' + fileName, function (error) {
            if (!error) {
                news.news_photo = "/" + fileName;
                if (database != null) {
                    database.query("UPDATE news SET title = " + "'" + news.title + "'" + ", sub_title = '" + news.sub_title + "', news_source = '" + news.news_source + "', news_detail = '" + news.news_detail + "', is_featured = " + news.is_featured + ", is_top_story = " + news.is_top_story + ", is_video = " + news.is_video + ", is_video_of_the_day = " + news.is_video_of_the_day + ", video_link = '" + news.video_link + "', topic_id = '" + news.topic_id + "', sub_topic_id = '" + news.sub_topic_id + "', news_photo = '" + news.news_photo + "' WHERE id = ?", news.id, function (error, result) {
                        if (!error) {
                            request.flash('message', 'News updated successfully!');
                            response.redirect('/news/edit/' + news.id);
                        } else {
                            response.send(error);
                        }
                    });
                }
            } else {
                response.send(error);
            }
        });
    } else {
        if (database != null) {
            database.query("UPDATE news SET title = '" + news.title + "', sub_title = '" + news.sub_title + "', news_source = '" + news.news_source + "', news_detail = '" + news.news_detail + "', is_featured = " + news.is_featured + ", is_top_story = " + news.is_top_story + ", is_video = " + news.is_video + ", is_video_of_the_day = " + news.is_video_of_the_day + ", video_link = '" + news.video_link + "', topic_id = '" + news.topic_id + "', sub_topic_id = '" + news.sub_topic_id + "', news_photo = '' WHERE id = ?", news.id, function (error, result) {
                if (!error) {
                    request.flash('message', 'News updated successfully!');
                    response.redirect('/news/edit/' + news.id);
                } else {
                    response.send(error);
                }
            });
        }
    }
});

// Route to delete a news item (Updated)
router.get('/delete/:id', function(req, res) {
    if (database != null) {
        database.query("DELETE FROM news WHERE id = ?", req.params.id, function (err, data) {
            if (err) {
                req.flash('message', 'Database error!');
                res.send(err);
            } else {
                req.flash('message', 'News deleted!');
                res.redirect('/news/all');
            }
        });
    } else {
        req.flash('message', 'Database error!');
        res.redirect('/news/all');
    }
});

module.exports = router;
