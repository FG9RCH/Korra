/**
 * Created by Frank on 3/10/2016.
 */
var mongoose = require('mongoose');


var CampaignSchema =  new mongoose.Schema({
    title: String,
    description: String,
    raised: Number,
    imgPath: String,
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Campaign', CampaignSchema);