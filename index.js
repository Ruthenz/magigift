/************* Requires *************/
var express = require('express');
var fs = require('fs');





/************* Static Configurations *************/
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






/************* Starting server *************/
app.listen(config.port, function () {
    console.log('Server listening on port ' + config.port);
});