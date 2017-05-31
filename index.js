/************* Requires *************/
var express = require('express');
var fs = require('fs');
var amazon = require('amazon-product-api');





/************* Static Configurations *************/
var app = express();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var static_folders = ['css', 'img', 'js', 'owl-carousel', 'font'];
static_folders.forEach(function (folder) {
    app.use('/' + folder, express.static(__dirname + '/' + folder));
});

//
//    var client = amazon.createClient({
//        awsId: "AKIAIMQKBBTZYQT5KXZA",
//        awsSecret: "CuEaczTSZ7OTwNJaQnSnRfa2pDvw",
//        awsTag: "Tag"
//    });
//
//    client.itemSearch({
//        director: 'Quentin Tarantino',
//        actor: 'Samuel L. Jackson',
//        searchIndex: 'DVD',
//        audienceRating: 'R',
//        responseGroup: 'ItemAttributes,Offers,Images'
//    }, function (err, results, response) {
//        if (err) {
//            console.log(err.Error[0].Message);
//        } else {
//            console.log(results); // products (Array of Object) 
//            console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.) 
//        }
//    });

/************* Requests *************/
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

var ebay = require('ebay-api');

var params = {
    keywords: ["FIFA"],

    // add additional fields
    outputSelector: ['AspectHistogram'],

    paginationInput: {
        entriesPerPage: 10
    },

    itemFilter: [
        {
            name: 'FreeShippingOnly',
            value: true
        },
        {
            name: 'MaxPrice',
            value: '150'
        }
    ]

//    domainFilter: [
//        {
//            name: 'domainName',
//            value: 'Digital_Cameras'
//        }
//    ],

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
    parser: ebay.parseResponseJson // (default)
}, function itemsCallback(error, itemsResponse) {

    if (error) throw error;

    //console.log(itemsResponse.searchResult.item[0]);

    ebay.xmlRequest({
        'serviceName': 'Shopping',
        'opType': 'GetSingleItem',
        appId: 'WootWoot-magigift-PRD-d090330f6-d2fa7a5f',
        devId: '76f1654a-53d4-482f-b76f-61385e481990',
        certId: 'PRD-090330f65088-ad07-4aa8-8580-b223',
        params: {
            'ItemID': itemsResponse.searchResult.item[1].itemId,
            'includeSelector': 'Description, ItemSpecifics, SecondaryCategoryName, SecondaryCategoryID'
        }
    }, function (error, data) {
        console.log(data.Item.ItemSpecifics.NameValueList);
    });

    //        var items = itemsResponse.searchResult.item;
    //
    //        console.log('Found', items.length, 'items');
    //
    //        for (var i = 0; i < items.length; i++) {
    //            console.log('- ' + items[i].title);
    //        }
});

//ebay.xmlRequest({
//    'serviceName': 'Shopping',
//    'opType': 'GetSingleItem',
//    appId: 'WootWoot-magigift-PRD-d090330f6-d2fa7a5f',
//    devId: '76f1654a-53d4-482f-b76f-61385e481990',
//    certId: 'PRD-090330f65088-ad07-4aa8-8580-b223',
//    params: {
//        'ItemID': '201906531458',
//        'includeSelector': 'Details,Description'
//    }
//}, function (error, data) {
//    console.log(data);
//});



/************* Starting server *************/
app.listen(config.port, function () {
    console.log('Server listening on port ' + config.port);
});