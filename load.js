var hujiServer = require('./hujiwebserver');
var rootDir = './some/Folder';
var testPort = 8000;
var testHost = 'localhost';
var stressLevel = 300;
var requests = [];
var errorCount = 0;
var successes = 0;


var server = hujiServer.start(testPort, rootDir, function (e) {
    e ? (console.log(e)) : (console.log("server is up"));

    var legalFiles = ['/bla.txt'];
    var http = require('http');

    callback = function (response, i) {
        console.log("response");
        var str = '';

        if (response.statusCode != 200){
            console.log(testDelimeter);
            console.log("requesting " + i);
            console.log("Error!!! response code is not 200. code is: " + response.statusCode);
            console.log(testDelimeter);
            errorCount ++;
        }

        response.on('data', function (chunk) {
            //console.log(chunk);
            str += chunk;
        });

        response.on('end', function () {
            console.log("response fully received");
            //console.log(str);
            successes ++;
        });
    };
    var j;
    for (j = 0 ; j < stressLevel * legalFiles.length ; j++) {
        legalFiles.forEach(function(i){
            var options = {
                host: testHost,
                port: testPort,
                path: i
            };
            try {
                requests.push(http.request(options, function (response) {callback(response, i)}));
            } catch (error){
                console.log("request error: " + error);
            }
        });
    }
    for (j = 0 ; j < stressLevel ; j++) {
        requests[j].end();
    }


    setTimeout(function x(){
        server.stop();
        console.log("Test ended.");
        console.log("Number of errors: " + errorCount.toString());
        console.log("Number of successes: " + successes.toString());
    },11 * stressLevel * legalFiles.length )
});