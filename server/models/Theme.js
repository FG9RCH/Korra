/**
 * Created by Frank on 9/15/2016.
 */
var mongoose = require('mongoose');


var ThemeSchema =  new mongoose.Schema({
        name: { type : String , unique : true, required : true, dropDups: true },
        baseCss: { type : String , required : true, dropDups: true },
        baseUrl: String,
        customCss: { type : String , required : true, dropDups: true },
        customUrl: String,
        active: Boolean
    });

module.exports = mongoose.model('Theme', ThemeSchema);