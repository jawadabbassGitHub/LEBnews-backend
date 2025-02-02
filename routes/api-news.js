var express = require('express');
var database = require('../config/db_connection');

var router = express.Router();

router.get('/get-all', function(request, response){
    if(database != null){
        database.query("SELECT * FROM news", function(error, news){
            response.send({news: news});
        });
    }
});

router.get('/get-by-id/:id', function(request, response){
    if(database != null){
        database.query("SELECT * FROM news WHERE id = ?", request.params.id, function(error, news){
            response.send({news: news[0]});
        })
    }
});

router.get('/get-by-topic/:topicId', function(request, response){
    if(database != null){
        database.query("SELECT * FROM news WHERE topic_id = ?", request.params.topicId, function(error, news){
            response.send({news: news[0]});
        });
    }
});

router.get('/get-featured-news', function(request, response){
    if(database != null){
        database.query("SELECT * FROM news WHERE is_featured = 1", function(error, news){
            response.send({news: news[0]});
        });
    }
});

module.exports = router;