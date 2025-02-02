var express = require('express');
var database = require('../config/db_connection');

var router = express.Router();

router.get('/get-all', function(request, response){
    if(database != null){
        database.query("SELECT * FROM topic", function(error, topics){
            response.send({topics : topics });
        });
    }
});

router.get('/get-by-id/:topicId', function(request, response){
    if(database != null){
        database.query("SELECT * FROM topic WHERE id = ? ", request.params.topicId, function(error, topics){
            response.send({topic: topics[0]});
        });
    }
})

module.exports = router;