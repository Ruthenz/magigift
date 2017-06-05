/************* Requires *************/
var htmlToText = require('html-to-text');
var mongoose = require('mongoose');
var ebay = require('ebay-api');
var fs = require('fs');


/************* Config **************/
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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
    keyword: [String]
});

// the schema is useless so far
// we need to create a model using it
var ebay_items = mongoose.model('ebay_items', itemSchema);


/************* Static Configurations *************/
// Connecting to mongoose
mongoose.connect(config.mongo.db);


/************* Functions *************/

function query_ebay(keywords) {
    var params = {
        keywords: keywords,

        paginationInput: {
            entriesPerPage: entries_per_page
        },

        itemFilter: [{
            name: 'HideDuplicateItems',
            value: true
        }]
    };

    ebay.xmlRequest({
        serviceName: 'Finding',
        opType: 'findItemsByKeywords',
        appId: config.ebay_keys.prod.appId,
        devId: config.ebay_keys.prod.devId,
        certId: config.ebay_keys.prod.certId,
        params: params,
        parser: ebay.parseResponseJson
    }, function itemsCallback(error, itemsResponse) {

        if (error) throw error;
        
        for (var i = 0; i < entries_per_page; i++) {

            ebay.xmlRequest({
                'serviceName': 'Shopping',
                'opType': 'GetSingleItem',
                appId: config.ebay_keys.prod.appId,
                devId: config.ebay_keys.prod.devId,
                certId: config.ebay_keys.prod.certId,
                params: {
                    'ItemID': (itemsResponse.searchResult.item.itemId) ? itemsResponse.searchResult.item.itemId : itemsResponse.searchResult.item[i].itemId,
                    'includeSelector': 'Description, ItemSpecifics'
                }
            }, function (error, data) {
                    
                // Duplicating the obj to make a new one for saving
                var saving_obj = Object.assign({}, data.Item);
                                
                // Getting the object ready for saving
                saving_obj.keyword = keywords;
                saving_obj._id = data.Item.ItemID;
                saving_obj.Description = htmlToText.fromString(data.Item.Description);
                if (data.Item.ItemSpecifics) {
                    saving_obj.ItemSpecifics = data.Item.ItemSpecifics.NameValueList;
                }
                delete saving_obj.ItemID;
                
                // Saving the object to the db
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
}

/************* Settings for the query *************/
var entries_per_page = 100;
var keywords = 
    [
        ["Women, Sport"],
        ["Women, Cloths"],
        ["Books"],
        ["Jewelry"],
        ["Electronics"],
        ["Gamer"],
        ["Party"],
        ["Travel"],
        ["Cooking"],
        ["Men, Cloths"],
        ["Music"],
        ["Crafts"],
        ["Animal"],
        ["Men, Sport"],
        ["Sport"]
    ];

for (var i=0; i<keywords.length; i++) {
    query_ebay(keywords[i]);
}

