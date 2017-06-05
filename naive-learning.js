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
    Classifier: [{
        key: String, 
        value: String
    }]
} 

);

/************* Static Configurations *************/
// Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/database_mongo');

// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items');
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
        
        ebay_items.find({ "keyword" : keywords[i] },function(err, data){
            for(var j = 0; j < data.length; j++){
                
                console.log("-----------------------------------------------------------------")
                console.log("--------------------LEARNING ITEM NO. "+ j+" " + data[j].keyword + "---------------------------")
                console.log("-----------------------------------------------------------------")
                
                var stringJson = data[j].toString();
                
                classifier.learn(stringJson, data[j].keyword);
            }
        })
    }
});

setTimeout(testingFunc, 25000);


function testingFunc(){
//    'keyword' : 'Party'
//var q = ebay_items_test.find({}).sort({'date': -1}).limit(300);
var q = ebay_items.find({}, function(err, data){
    
    var counterCorrect = 0;
     for(var j = 0; j < data.length; j++){
         
            console.log("-----------------------------------------------------------------")
            console.log("--------------------Classiffy ITEM NO. "+ j+" Keyword " + data[j].keyword + "---------------------------")
            console.log("--------------------Title "+ data[j].Title + "---------------------------")
            console.log("-----------------------------------------------------------------")

            var stringJson = data[j].toString();

            var dataClassified = classifier.categorize(stringJson);

            //console.log("+++++++++++++++++++++++++++++++++++++++++++++");
                    console.log("+++++++++++++++++" + data[j]._id+ "++++++++++++++++");
            //console.log("+++++++++++++++++++++++++++++++++++++++++++++");

             dataClassified.sort(function(a,b) {
                return b.value - a.value;
            });

             if(data[j].keyword == dataClassified[0].key){
                 counterCorrect++;
             }
             console.log(dataClassified);

             ebay_items.update({"_id" : data[j]._id }, { $set: { "Classifier": dataClassified } }, { multi: false }, callback);
            
            function callback (err, numAffected) {
                if (err){
                console.error(err);
                }
//                console.log('NO AFFECTED' + numAffected);
              // numAffected is the number of updated documents
            }
                 
        }
    
        console.log("   ALL DATA: " + data.length + " CORRECT: " + counterCorrect);
    
    });
}


/************* Starting server *************/
app.listen(config.port, function () {
    console.log('Server listening on port ' + config.port);
});