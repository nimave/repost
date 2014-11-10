var fs = require('fs');
var http = require('http');

var util = require('util');

var async = require('async');

var AsyncSquaringLibrary = {
    squareExponent: 2,
    square: function(number, callback){
        var result = Math.pow(number, this.squareExponent);
        setTimeout(function(){
            callback(null, result);
        }, 200);
    }
};

var output;

output = async.map([1, 2, 3], AsyncSquaringLibrary.square.bind(AsyncSquaringLibrary), function (err, result) {
    // result is [NaN, NaN, NaN]
    // This fails because the `this.squareExponent` expression in the square
    // function is not evaluated in the context of AsyncSquaringLibrary, and is
    // therefore undefined.
});

console.log(output);
console.log(Math.pow(10,2));

//ascending order
var output_2;


async.sortBy([1,9,3,5], function(x, callback){
    callback(err, x);
}, function(err,result){
    console.log(result);
} );

