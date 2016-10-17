/**
 * Created by Frank on 10/16/2016.
 */
var mongoose = require('mongoose');

var SliderSchema =  new mongoose.Schema({
        title: String,
        description: String,
        imgPath: String,
    });

module.exports = mongoose.model('Slider', SliderSchema);