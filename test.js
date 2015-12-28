var hujiServer = require('./hujiwebserver');
var rootDir = './some/Folder';
var testPort = 8000;
var testHost = 'localhost';
var testDelimeter = "==================================================================";
var errorCount = 0;

// Launch the server
var server = hujiServer.start(testPort, rootDir, function (e) {
    e ? (console.log(e)) : (console.log("server is up"));

    // List of existing and legal files, list of non existing files, and list of illegal files.
    var legalFiles = ['/ex2/index.html', '/ex2/rick.jpg', '/ex2/roll.png', '/ex2/main.js', '/ex2/style.css'];
    var noFiles = ['/ex2/blat.html'];
    var illegalFiles= ['/../test.htm','cyka.htmr'];
    var http = require('http');

    var legalReqFunc = function (response, i) {
        console.log("response");
        var str = '';

        if (response.statusCode != 200){
            console.log(testDelimeter);
            console.log("requesting " + i);
            console.log("Error!!! response code is not 200. code is: " + response.statusCode);
            console.log(testDelimeter);
            errorCount ++;
        }

        // On every response, add the data to the current buffer.
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log("response fully received");
        });
    };

    // Iterate over all the legal file requests.
    legalFiles.forEach(function(i){
        var options = {host: testHost, port: testPort, path: i};

        try {
            var request = http.request(options, function (response) {legalReqFunc(response, i)});
            request.end();
        } catch (error){
            console.log("request error: " + error);
        }
    });

    // Iterate over all files which do not exist.
    noFiles.forEach(function(i){
        var options = {host: testHost, port: testPort, path: i};

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


    // Iterate over all files which are illegal.
    illegalFiles.forEach(function(i){
        var options = {host: testHost, port: testPort, path: i};

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


    // Shut the server down after testing finishes.
    setTimeout(function x(){
        server.stop();
        console.log("Test ended. Number of errors: " + errorCount.toString());
    },2500 )
});