var express = require('express');
var database = require('../config/db_connection');

var router = express.Router();

router.get('/all', function(req, res){
    if(database != null){
        database.query('SELECT * FROM sub_topic', function(err, results){
            res.render('sub-topics-all', { subTopics : results, message : req.flash('message') });
        });
    } else {
        res.render('sub-topics-all', { subTopics : [{}], message : req.flash('message') });
    }
});

router.get('/create', function(req, res){
    if(database != null){
        database.query('SELECT * FROM topic', function(err, results){
            if(!err){
                res.render('sub-topics-create', { topics : results, message : req.flash('message') });
            } else {
                res.send(err);
            }
        });
    } else {
        res.render('sub-topics-create', { topics : [{}], message : req.flash('message') });
    }
});

router.post('/post-form', function(req, res){
    if(database != null){
        database.query('INSERT INTO sub_topic SET ?', req.body, function(err, rs){
            if(err){
                res.send(err.message);
            } else {
                req.flash('message', 'Sub Topic insrted successfully!');
                res.redirect('/sub-topics/create');
            }
        });
    } else {
        res.redirect('/sub-topics/create');
    }
});


router.get('/edit/:id', function(req, res){
    var topics = [];
    if(database != null){
        
        database.query('SELECT * FROM topic', function(err, results){
            topics = results;
        });

        database.query("SELECT * FROM sub_topic WHERE id = ? ", req.params.id, function (err, data) {             
            if(err) {
                res.send(err);
            }
            else{
                res.render('sub-topics-edit', { subTopic : data[0], topics : topics, message : req.flash('message')});    
            }
        });
    }
});

router.post('/update/:id', function(req, res, next){
    var subTopic = {
        sub_topic_name : req.body.sub_topic_name,
        topic_id: req.body.topic_id,
        id: req.params.id
    }

    if(database != null){
        database.query("UPDATE sub_topic SET sub_topic_name = " + "'" + subTopic.sub_topic_name + "'" + ", topic_id = " + "'" + subTopic.topic_id + "'" + "WHERE id = ?", subTopic.id, function(err, rs){
            if(err){
                res.render('sub-topics-edit');
            }
            else {
                req.flash('message', 'Sub Topic updated successfully!');
                res.redirect('/sub-topics/edit/' + subTopic.id);
            }
        });
    } else {
        res.redirect('/sub-topics/edit/' + subTopic.id);
    }
});

router.get('/delete/:id', function(req, res){
    if(database != null){
        database.query("DELETE FROM sub_topic WHERE id = ? ", req.params.id, function (err, data) {             
            if(err) {
                req.flash('message', 'Database error!');
                res.send(err);
            }
            else{
                req.flash('message', 'Sub Topic deleted!');
                res.redirect('/sub-topics/all');
            }
        });
    } else {
        req.flash('message', 'Database error!');
        res.redirect('/sub-topics/all');
    }
});

module.exports = router;