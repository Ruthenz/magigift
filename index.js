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
    _id: String
    , Description: String
    , EndTime: Date
    , ViewItemURLForNaturalSearch: String
    , ListingType: String
    , Location: String
    , PictureURL: [String]
    , PrimaryCategoryID: String
    , PrimaryCategoryName: String
    , BidCount: String
    , ConvertedCurrentPrice: {
        amount: Number
        , currencyID: String
    }
    , ListingStatus: String
    , TimeLeft: String
    , Title: String
    , ItemSpecifics: [{
        Name: String
        , Value: String
    }]
    , Country: String
    , AutoPay: String
    , ConditionID: String
    , ConditionDisplayName: String
    , GlobalShipping: String
    , keyword: String
    , webKeyword: String
    , gender: String
    , Classifier: [{
        key: String
        , value: String
    }]
});
// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items');
app.get('/', function (req, res) {
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
        _id: String
        , Description: String
        , EndTime: Date
        , ViewItemURLForNaturalSearch: String
        , ListingType: String
        , Location: String
        , PictureURL: [String]
        , PrimaryCategoryID: String
        , PrimaryCategoryName: String
        , BidCount: String
        , ConvertedCurrentPrice: {
            amount: Number
            , currencyID: String
        }
        , ListingStatus: String
        , TimeLeft: String
        , Title: String
        , ItemSpecifics: [{
            Name: String
            , Value: String
        }]
        , Country: String
        , AutoPay: String
        , ConditionID: String
        , ConditionDisplayName: String
        , GlobalShipping: String
        , keyword: [String]
    });
    mongoose.connect(config.mongo.db);
    // Connecting to mongoose
    // mongoose.connect('mongodb://localhost:27017/database_mongo');
    // the schema is useless so far
    // we need to create a model using it
    var ebay_items = mongoose.model('ebay_items', itemSchema, 'ebay_items');
    ebay_items.collection.distinct('keyword', function (error, keywords) {
        res.send(keywords);
    });
});
var divideCategories = function (categories) {
        // Creating the map:
        var categoriesByChoice = [];
        for (var i = 0; i < categories.length; i++) {
            if (!categoriesByChoice[categories[i].value]) {
                categoriesByChoice[categories[i].value] = [];
            }
            categoriesByChoice[categories[i].value].push({
                key: categories[i].key
                , value: categories[i].value
            });
            //    categoriesByChoice.set(categories.value, categories.key)
        }
        return categoriesByChoice;
    }
    // Getting an array:
    //nameArray = categoriesByChoice.get(person.firstName);
    // Adding an array:
    //nameArrays.set(person.firstName, []);
    // Looping through the map:
    //for (let [firstName, nameArray] of nameArrays) {
    // Use `firstName` and `nameArray` here
    //}
var permArr = []
var usedChars = [];
var permute = function (input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};
var pushPermute = function (currentChain, currentArray) {
    for (var i = 0; i < currentArray.length; i++) {
        currentChain.push(currentArray[i])
    }
    return currentChain;
}
app.post('/searchGifts', function (req, res) {
    var UserChoices = req.body;
    var categoriesByChoice = divideCategories(UserChoices.categories);
    var allPermute = [];
    var allChainPermute = [];
    if (permArr) {
        permArr = []
        usedChars = [];
    }
    if (categoriesByChoice[5]) {
        allPermute.push(permute(categoriesByChoice[5]));
        permArr = []
        usedChars = [];
    }
    
    if (categoriesByChoice[4]) {
        allPermute.push(permute(categoriesByChoice[4]));
        permArr = []
        usedChars = [];
    }
    
    if (categoriesByChoice[3]) {
        allPermute.push(permute(categoriesByChoice[3]));
        permArr = []
        usedChars = [];
    }
    
    if (allPermute[0].length > 0 && !allPermute[1] && !allPermute[2]) {
        for (var i = 0; i < allPermute[0].length; i++) {
            var currentChain = [];
            currentChain = pushPermute(currentChain, allPermute[0][i])
            allChainPermute.push(currentChain);
        }
    }
    else if (allPermute[0].length > 0 && allPermute[1].length > 0 && allPermute[2].length > 0) {
        for (var i = 0; i < allPermute[0].length; i++) {
            for (var j = 0; j < allPermute[1].length; j++) {
                for (var k = 0; k < allPermute[2].length; k++) {
                    var currentChain = [];
                    currentChain = pushPermute(currentChain, allPermute[0][i])
                    currentChain = pushPermute(currentChain, allPermute[1][j])
                    currentChain = pushPermute(currentChain, allPermute[2][k])
                    allChainPermute.push(currentChain);
                }
            }
        }
    }
    

//    var forthPermute    = (categoriesByChoice[4]) : (permute(categoriesByChoice[4])) ? ([]);
//    var thirdPermute    = (categoriesByChoice[3]) : (permute(categoriesByChoice[3])) ? ([]);
//    var secondPermute   = (categoriesByChoice[2]) : (permute(categoriesByChoice[2])) ? ([]);
//    var firstPermute    = (categoriesByChoice[1]) : (permute(categoriesByChoice[1])) ? ([]);
//    
//    $scope.categories = ["Sport", "Outdoors", "Creative", "Cooking", "Fashion", "Electronics", "Party", "Books", "Gamer", "Animals"];
//    $scope.UserChoices = [];
//    var counter = 0;
//    
//    angular.forEach($scope.categories, function (value, key) {
//        var categoryChoice = ($('input[name=' + value + ']:checked')[0].id).split(value)[1];
//        if (categoryChoice == 5 || categoryChoice == 4) {
//            $scope.UserChoices[counter] = {
//                key: value
//                , value: categoryChoice
//            };
//            counter++
//        }
//    })
//    if (permArr) {
//        permArr = []
//        usedChars = [];
//    }
//    var allPermute = permute($scope.UserChoices);
var query = {
    $and: [
        {
            $or: []
                    }
                    , {
            $and: [{
                "ConvertedCurrentPrice.amount": {
                    $gte: UserChoices.price[0]
                }
                        }, {
                "ConvertedCurrentPrice.amount": {
                    $lte: UserChoices.price[1]
                }
                        }]
                    }
                    , {
            "gender": UserChoices.gender
                    }
                             ]
};
for (var i = 0; i < allChainPermute.length; i++) {
    var arrCurrentPermute = {};
    for (var j = 0; j < allChainPermute[i].length; j++) {
        arrCurrentPermute["Classifier." + j + ".key"] = allChainPermute[i][j].key;
    }
    query.$and[0].$or.push(arrCurrentPermute);
}
var config = JSON.parse(fs.readFileSync('config.json', 'utf8')); mongoose.connect(config.mongo.db);
// Connecting to mongoose
// mongoose.connect('mongodb://localhost:27017/database_mongo');
// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items'); console.log(query); ebay_items.find(query).limit(12).exec(function (err, result) {
    console.log(result);
    res.send(result);
});
});
// });