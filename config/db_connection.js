var mysql = require('mysql');

var connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news_db',
    debug: false
});

module.exports = connectionPool;