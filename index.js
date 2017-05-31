/************* Requires *************/
var express = require('express');
var fs = require('fs');
var amazon = require('amazon-product-api');
var htmlToText = require('html-to-text');
var mongoose = require('mongoose');

/************* Globals *************/
var entries_per_page = 100;
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
});

// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema);


/************* Static Configurations *************/
// Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/magigift');

var app = express();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var static_folders = ['css', 'img', 'js', 'owl-carousel', 'font'];
static_folders.forEach(function (folder) {
    app.use('/' + folder, express.static(__dirname + '/' + folder));
});



/************* Requests *************/
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

var ebay = require('ebay-api');

var params = {
    keywords: ["Travel"],
    
    paginationInput: {
        entriesPerPage: entries_per_page
    },

    itemFilter: [
        {
            name: 'HideDuplicateItems',
            value: true
        }
    ]
};

// Prod
//        appId: 'WootWoot-magigift-PRD-d090330f6-d2fa7a5f', 
//        devId : '76f1654a-53d4-482f-b76f-61385e481990',
//        certId: 'PRD-090330f65088-ad07-4aa8-8580-b223',

// Sandbox
//        appId: 'WootWoot-magigift-SBX-1dbc19de5-2cfc9281', 
//        devId : '76f1654a-53d4-482f-b76f-61385e481990',
//        certId: 'SBX-dbc19de5d496-2a8a-40c0-af26-14e5',

ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: 'WootWoot-magigift-PRD-d090330f6-d2fa7a5f',
    devId: '76f1654a-53d4-482f-b76f-61385e481990',
    certId: 'PRD-090330f65088-ad07-4aa8-8580-b223',
    params: params,
    parser: ebay.parseResponseJson
}, function itemsCallback(error, itemsResponse) {

    if (error) throw error;

    for (var i = 0; i < entries_per_page; i++) {
        //console.log('Item id : ' + itemsResponse.searchResult.item[i].itemId);

        ebay.xmlRequest({
            'serviceName': 'Shopping',

            'opType': 'GetSingleItem',
            appId: 'WootWoot-magigift-PRD-d090330f6-d2fa7a5f',
            devId: '76f1654a-53d4-482f-b76f-61385e481990',
            certId: 'PRD-090330f65088-ad07-4aa8-8580-b223',
            params: {
                'ItemID': itemsResponse.searchResult.item[i].itemId,
                'includeSelector': 'Description, ItemSpecifics'
            }
        }, function (error, data) {

            var text = htmlToText.fromString(data.Item.Description);

            var saving_obj = Object.assign({}, data.Item);
            saving_obj._id = data.Item.ItemID;
            saving_obj.Description = text;
            if (data.Item.ItemSpecifics) {
                saving_obj.ItemSpecifics = data.Item.ItemSpecifics.NameValueList;
            }
            delete saving_obj.ItemID;

            var mongo_ready_obj = new ebay_items(saving_obj);
            mongo_ready_obj.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Saved item : ' + data.Item.Title);
                }
            });
        });
    }

});


/************* Starting server *************/
app.listen(config.port, function () {
    console.log('Server listening on port ' + config.port);
});