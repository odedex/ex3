

function maintainConnection (connection, httpVer, socket) {
    console.log("in maintain connection"); //todo: delete this
    if (connection === "close" || (connection !== "keep-alive" && httpVer === "HTTP/1.0")) {
        socket.end();
    }
}

//function RequestObj () {
//    return this;
//}

function Handler(socket, rootFolder) {
    var mySocket = socket;
    var myPath = rootFolder;
    var reqObj = {};
    var hujirequestparser = require("./hujirequestparser.js");
    this.parseData = function (data) {
        //console.log ("data parse request"); //todo: delete this
        reqObj = hujirequestparser.parseRequest(data, reqObj, function(reqObj) {
            var path = require("path");
            var fullPath = rootFolder + reqObj.fpath;
            var absRootPath = path.resolve(rootFolder);
            var absFilePath = path.resolve(fullPath);
            //console.log(reqObj); //todo: delete this
            if (reqObj.validRequest !== 'undefined' && reqObj.validRequest) {
                if (reqObj.requestType !== "GET" || reqObj.fileTypeHtml[0] === "bad" ||
                    absFilePath.slice(0, absRootPath.length) != absRootPath) {
                    console.log("500: bad http request.");
                    socket.write(reqObj.httpVer + " 500 Internal Server Error\r\n");
                    socket.write("Content-Type: " + reqObj.fileType + "\r\n");
                    socket.write("Content-Length: 0\r\n");
                    socket.write("\r\n");
                    maintainConnection(reqObj.connection, reqObj.httpVer, socket);
                }
                else {
                    //console.log(reqObj); //todo: delete this
                    var fs = require("fs");
                    fs.exists(fullPath, function(fileExists) {
                        if (!fileExists) {
                            console.log("404: file does not exist: " + fullPath);
                            socket.write(reqObj.httpVer + " 404 Not Found\r\n");
                            socket.write("Connection: " + reqObj.connection + "\r\n");
                            socket.write("Content-Type: " + reqObj.fileTypeHtml + "\r\n");
                            socket.write("Content-Length: 0\r\n");
                            socket.write("\r\n");
                            maintainConnection(reqObj.connection, reqObj.httpVer, socket);
                        }
                        else {
                            fs.stat(fullPath, function(err, stat) {
                                if (err) {
                                    console.log("error stat'ing file after found file exists. should be unreachable.");
                                    throw err;
                                }
                                else {
                                    var fileAsStream = fs.createReadStream(fullPath);
                                    var pipeEvent;
                                    console.log("200: file exists");
                                    socket.write(reqObj.httpVer + " 200 OK\r\n");
                                    socket.write("Connection: " + reqObj.connection + "\r\n");
                                    socket.write("Content-Type: " + reqObj.fileTypeHtml + "\r\n");
                                    socket.write("Content-Length: " + stat.size + "\r\n");
                                    socket.write("\r\n");
                                    pipeEvent = fileAsStream.pipe(socket);
                                    pipeEvent.on('finish', function() {maintainConnection(reqObj.connection, reqObj.httpVer, socket);});
                                }
                            });
                        }
                    });
                    if (reqObj.connection === "keep-alive") {
                        console.log("socket kept alive");
                        socket.setTimeout(2000);
                    }
                }
            }
        });


        //console.log(splittedRequest); //todo: delete this


    };

    return this;
}


module.exports.Handler = Handler;