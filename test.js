var hujiServer = require('./hujiwebserver');
var rootDir = './some/Folder';
var testPort = 8000;
var testHost = 'localhost';
var testDelimeter = "==================================================================";
var errorCount = 0;

var server = hujiServer.start(testPort, rootDir, function (e) {
    e ? (console.log(e)) : (console.log("server is up"));

    var legalFiles = ['/ex2/index.html', '/ex2/rick.jpg', '/ex2/roll.png', '/ex2/main.js', '/ex2/style.css'];
    var noFiles = ['/ex2/indexsdfsdfsd.html'];
    var illegalFiles= ['/../test.htm','index.htmr'];
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
        });
    };

    legalFiles.forEach(function(i){
        var options = {
            host: testHost,
            port: testPort,
            path: i
        };

        try {
            var request = http.request(options, function (response) {callback(response, i)});
            request.end();
        } catch (error){
            console.log("request error: " + error);
        }
    });

    noFiles.forEach(function(i){
        var options = {
            host: testHost,
            port: testPort,
            path: i
        };

        try {
            var request = http.request(options, function x(response){
                if (response.statusCode != 404){
                    console.log(testDelimeter);
                    console.log("requesting " + i);
                    console.log("Error!!! response code is not 404. code is: " + response.statusCode);
                    console.log(testDelimeter);
                    errorCount++;
                }
            });
            request.end();
        } catch (error){
            console.log("request error: " + error);
        }

    });


    illegalFiles.forEach(function(i){
        var options = {
            host: testHost,
            port: testPort,
            path: i
        };

        try {

            var request = http.request(options, function x(response){
                if (response.statusCode != 500){
                    console.log(testDelimeter);
                    console.log("requesting " + i);
                    console.log("Error!!! response code is not 500. code is: " + response.statusCode);
                    console.log(testDelimeter);
                    errorCount++;
                }
            });
            request.end();
        } catch (error){
            console.log("request error: " + error);
        }

    });

    setTimeout(function x(){
        server.stop();
        console.log("Test ended. Number of errors: " + errorCount.toString());
    },2500 )
});