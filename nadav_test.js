var hujiServer = require('./hujiwebserver');
var rootDir = './some/Folder';
var testPort = 8000;
var testDelimeter = "==================================================================";
var server = hujiServer.start(testPort, rootDir, function (e) {
    e ? (console.log(e)) : (console.log("server is up"));

    var files = ['/ex2/index.html', '/ex2/rick.jpg', '/ex2/roll.png', '/ex2/main.js', '/ex2/style.css'];
    var noFiles = ['/ex2/indexsdfsdfsd.html'];
    var illegalFiles= ['/../test.htm','index.htmr'];
    var http = require('http');

    callback = function (response, i) {
        console.log("response");
        var str = '';

        if (response.statusCode != 200){
            console.log(testDelimeter);
            console.log("requesting " + i);
            console.log("Error!!! response code is not 200 when it should be");
            console.log(response.statusCode);
            console.log(testDelimeter);
        }

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            //console.log(chunk);
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            console.log("end");
            //console.log(str);
        });
    };

    files.forEach(function(i){
        var options = {
            host: 'localhost',
            port: testPort,
            path: i
        };

        try {
            var request = http.request(options, function (response) {callback(response, i)});
            //var request = http.request(options, callback);
            request.end();
        } catch (error){
            console.log("error" + error);
        }

    });

    noFiles.forEach(function(i){
        var options = {
            host: 'localhost',
            port: testPort,
            path: i
        };

        try {
            http.request(options, function x(response){
                if (response.statusCode != 404){
                    console.log(testDelimeter);
                    console.log("requesting " + i);
                    console.log("Error!!!, result code is not 404 when it should be");
                    console.log(response.statusCode);
                    console.log(testDelimeter);
                }
            }).end();
        } catch (error){
            console.log("error" + error);
        }

    });


    illegalFiles.forEach(function(i){
        var options = {
            host: 'localhost',
            port: testPort,
            path: i
        };

        try {

            var request = http.request(options, function x(response){
                if (response.statusCode != 500){
                    console.log(testDelimeter);
                    console.log("requesting " + i);
                    console.log("Error!!! response code is not 500 when it should be");
                    console.log(response.statusCode);
                    console.log(testDelimeter);
                }
            }).end();
        } catch (error){
            console.log("error" + error);
        }

    });

    setTimeout(function x(){
        server.stop();
        console.log("Test Ended");
    },5000 )





});