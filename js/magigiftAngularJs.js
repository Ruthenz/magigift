// /**
//  * Created by maaya on 06-Jun-17.
//  */
// var magiGiftApp = angular.module('magiGiftApp', []).controller('magiGiftController'['$scope', function($scope) {
//
//         $scope.categories = [];
//         // $http.get('/getCategories').success(function(allCategories) {
//         //     $scope.categories = allCategories;
//         // }).error(function (response, status, header, config) {
//         //     alert("ouh, an error...");
//         // });
//
//         // $http.get('/getCategories')
//
//     }]);

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.loadGifts = false;

    // $http.get('/getCategories').success(function(allCategories) {
    //     $scope.categories = allCategories;
    // }).error(function (response, status, header, config) {
    //     alert("ouh, an error...");
    // });

$scope.genderChange = function (gender) {
    $scope.gender = gender;
}
    $scope.generateResults = function () {

        $scope.gifts = [];
        var winWidth = $( window ).width();
        var winHeight = $( window ).height()
        $(".modalWait").width(winWidth);
        $(".modalWait").height(winHeight);
        $(".modalWait").removeClass("doNotShow");


        $scope.categories = ["Sport", "Outdoors", "Creative", "Cooking", "Fashion", "Electronics", "Party", "Books", "Gamer", "Animals"];
        $scope.UserChoices = [];
        var counter = 0;

        angular.forEach($scope.categories, function(value, key) {
            var categoryChoice = ($('input[name=' + value + ']:checked')[0].id).split(value)[1];

            if (categoryChoice == 5 || categoryChoice == 4){

                $scope.UserChoices[counter] = {key: value, value: categoryChoice};
                counter++
            }
        })




        var allPermute = permute($scope.UserChoices);
        var query = {
                    $and:[
                            {$or: []},
                            {$and: [{ "ConvertedCurrentPrice.amount":{ $gte: $scope.minPrice}}, { "ConvertedCurrentPrice.amount":{ $lte: $scope.maxPrice } } ]},
                            {"gender":$scope.gender}
                         ]
                    };

        angular.forEach(allPermute, function(value,key){

            var arrCurrentPermute = {};
            for(var i = 0; i < value.length; i++){
                arrCurrentPermute["Classifier." + i + ".key"] = value[i].key;
            }

            query.$and[0].$or.push(arrCurrentPermute);
        })

        $http.post('/searchGifts',JSON.stringify(query)).success(function(gifts) {
            $scope.gifts = gifts

            $(".modalWait").addClass("doNotShow");

            $scope.loadGifts = true;
        }).error(function (response, status, header, config) {
            alert("ouh, an error...");
        });
    }

    $scope.arrangeAll = function(allWithSameRate){

        var arrAllPossibleOptions = Atzeret(allWithSameRate.length);
v
    }

    var permArr = [],
        usedChars = [];

    function permute(input) {
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

    // // C program to print all permutations with duplicates allowed
    // /* Function to swap values at two pointers */
    // function swap(arr, locX, locY)
    // {
    //     var temp;
    //     temp =arr[locX];
    //     arr[locX] = arr[locY];
    //     arr[locY] = temp;
    //
    //     return arr;
    // }
    //
    // var counter = 0;
    // /* Function to print permutations of string
    //  This function takes three parameters:
    //  1. String
    //  2. Starting index of the string
    //  3. Ending index of the string. */
    // function permute(arr, start, arrLength, combinatioonsArr)
    // {
    //     var i;
    //
    //     if (start == arrLength) {
    //         combinatioonsArr[counter] = arr;
    //         console.log(arr);
    //         counter++
    //     }
    //     else
    //     {
    //         for (i = start; i <= arrLength; i++)
    //         {
    //             arr = swap(arr, start, (i));
    //             permute(arr, start+1, arrLength);
    //             arr = swap(arr, start, (i)); //backtrack
    //         }
    //     }
    // }

});