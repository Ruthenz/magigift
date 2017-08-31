/************* Requires *************/
var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');

/************* Globals *************/
var Schema = mongoose.Schema;

// create a schema
var itemSchema = new Schema({
    _id: String,
    Description: String,
    EndTime: Date,
    ViewItemURLForNaturalSearch: String,
    ListingType: String,
    Location: String,
    PictureURL: [String],
    PrimaryCategoryID: String,
    PrimaryCategoryName: String,
    BidCount: String,
    ConvertedCurrentPrice: {
        amount: Number,
        currencyID: String
    },
    ListingStatus: String,
    TimeLeft: String,
    Title: String,
    ItemSpecifics: [{
        Name: String,
        Value: String
    }],
    Country: String,
    AutoPay: String,
    ConditionID: String,
    ConditionDisplayName: String,
    GlobalShipping: String,
    keyword: String,
    webKeyword: String,
    gender: [String],
    Classifier: [{
        key: String, 
        value: String
    }]
});

/************* Static Configurations *************/
// Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/database_mongo');

// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items')
var ebay_items_training = mongoose.model('ebay_items_training', itemSchema, 'ebay_items_training');
var ebay_items_test = mongoose.model('ebay_items_test', itemSchema, 'ebay_items_test');

var app = express();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var bayes = require('./js/naive-bayes');
var classifier = bayes();

ebay_items.collection.distinct('keyword', function(error, keywords) {
    for(var i = 0; i < keywords.length; i++){
        
        
        
        
        
        console.log("****************************************************************** ")
        console.log("**************STARTING KEYWORD "+ keywords[i]+"*************** ")
        console.log("****************************************************************** ")
        
        function callback (err, numAffected) {
                if (err){
                console.error(err);
                }
//                console.log('NO AFFECTED' + numAffected);
              // numAffected is the number of updated documents
            }
        
        ebay_items.find({ "keyword" : keywords[i] },function(err, data){
            for(var j = 0; j < data.length; j++){
                
//                console.log('HERE ' + " " + data[j].keyword);
//                
                
//                keywords[i]
//                data[j] 
                
                if(data[j].keyword == "Music"){
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Music"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);      
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                 
                }
                else if (data[j].keyword == "Men, Cloths"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Fashion"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                }
                else if (data[j].keyword == "Women, Cloths"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Fashion"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Party"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Party"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Books"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Books"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
   
                }
                else if (data[j].keyword == "Video game"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Gamer"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                }
                else if (data[j].keyword == "Gamer"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Gamer"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Cell Phones"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Electronics"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Consumer Electronics"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Electronics"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                 
                }
                else if (data[j].keyword == "Crafts"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Creative"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Pet Supplies"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Animals"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Cooking"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Cooking"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                    
                }
                else if (data[j].keyword == "Men, Sport"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Sport"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                }
                else if (data[j].keyword == "Women, Sport"){
                    ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Sport"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["female"] } }, { multi: false }, callback);   
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                }
                else if (data[j].keyword == "Travel"){
                ebay_items.update({"_id" : data[j]._id }, { $set: { "webKeyword": ["Outdoors"] } }, { multi: false }, callback);   
                 ebay_items.update({"_id" : data[j]._id }, { $set: { "gender": ["male", "female"] } }, { multi: false }, callback);       
                    console.log('update ' + data[j].keyword + " " +data[j].name);
                
                }
                        
            }
        })
    }
});

