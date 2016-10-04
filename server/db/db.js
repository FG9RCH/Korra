var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('Connected to MongoDB');
        console.log('Server started on port 3000');
    }
});