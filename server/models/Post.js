/**
 * Created by Frank on 3/10/2016.
 */
var mongoose = require('mongoose');


var PostSchema =  new mongoose.Schema({
    title: String,
    description: String,
    imgPath: String,
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', PostSchema);