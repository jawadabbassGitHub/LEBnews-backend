var express = require('express');
var database = require('../config/db_connection');

var router = express.Router();

// Create topic form
router.get('/create', function(request, response, next){
    response.render('topic-create', { message : request.flash('message') });
});

// Handle post-form submission (creating a topic)
router.post('/post-form', function(request, response, next){
    if (database != null) {
        database.query('INSERT INTO topic SET ?', request.body, function(error, success){
            if (!error) {
                request.flash('message', 'Saved successfully');
                response.redirect('/topics/create');
            } else {
                response.send(error.message);
            }
        });
    }
});

// Display all topics
router.get('/all', function(request, response, next){
    if (database != null) {
        database.query('SELECT * FROM topic', function(error, results){
            if (!error) {
                response.render('topics-all', { topics: results });
            }
        });
    }
});

// Edit topic form
router.get('/edit/:id', function(request, response, next){
    if (database != null) {
        database.query('SELECT * FROM topic WHERE id = ?', request.params.id, function(error, data){
            if (!error) {
                response.render('topics-edit', { topic: data[0] });
            }
        });
    }
});

// Handle update form submission (editing a topic)
router.post('/update-form/:id', function(request, response){
    var topic = {
        topic_name: request.body.topic_name,
        id: request.params.id
    }

    if (database != null) {
        database.query("UPDATE topic SET topic_name = ? WHERE id = ?", [topic.topic_name, topic.id], function(error, data){
            if (!error) {
                response.send('Success');
            }
        });
    }
});

// Delete topic route
router.get('/delete/:id', function(request, response, next){
    if (database != null) {
        database.query('DELETE FROM topic WHERE id = ?', [request.params.id], function(error, results){
            if (!error) {
                response.redirect('/topics/all');
            } else {
                response.send(error.message);
            }
        });
    }
});

module.exports = router;
