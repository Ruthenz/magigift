/************* Requires *************/
var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');

/************* Config **************/
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));



/************* Static Configurations *************/
var app = express();

var static_folders = ['css', 'img', 'js', 'owl-carousel', 'font'];
static_folders.forEach(function (folder) {
    app.use('/' + folder, express.static(__dirname + '/' + folder));
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());


/************* Requests *************/
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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
    gender: String,
    Classifier: [{
        key: String,
        value: String
    }]
});

// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items');


app.get('/', function (req, res){


    res.sendFile(__dirname + "/index.html");
});

/************* Starting server *************/
app.listen(config.port, function () {
    console.log('Server listening on port ' + config.port);
});

app.get('/getCategories', function (req, res) {

    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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
        keyword: [String]
    });

    mongoose.connect(config.mongo.db);

    // Connecting to mongoose
    // mongoose.connect('mongodb://localhost:27017/database_mongo');

    // the schema is useless so far
    // we need to create a model using it
    var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items');

    ebay_items.collection.distinct('keyword',
    function(error, keywords) {
        res.send(keywords);
    });

});
app.post('/searchGifts', function (req, res) {

    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    mongoose.connect(config.mongo.db);

    // Connecting to mongoose
    // mongoose.connect('mongodb://localhost:27017/database_mongo');

    // the schema is useless so far
    // we need to create a model using it
    var ebay_items = mongoose.model('ebay_items');

    var val = eval(req.body);

    console.log(val);
    ebay_items.find(val).limit(12).exec(function(err, result){
        console.log(result);
        res.send(result);
    });

    });


// });