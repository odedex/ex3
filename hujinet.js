/**
 * Function to close a socket connection, depending on the http request
 * @param connection Connection header in the http request.
 * @param httpVer HTTP version (1.0 or 1.1) of the http request.
 * @param socket The socket to close if needed.
 */
function maintainConnection (connection, httpVer, socket) {
    if (connection === "close" || (connection !== "keep-alive" && httpVer === "HTTP/1.0")) {
        socket.end();
    }
}

/**
 * Handler object created for the server.
 * @param socket Socket to handle.
 * @param rootFolder Root folder path of the server.
 * @returns {Handler} Request handler object
 * @constructor
 */
function Handler(socket, rootFolder) {
    var hujirequestparser = require("./hujirequestparser.js");
    this.parseData = function (data) {
        var reqObj = {};
        reqObj = hujirequestparser.parseRequest(data, reqObj, function(reqObj) {

            // After parsing the request, make sure the file path requested is within in the root folder.
            var path = require("path");
            var fullPath = rootFolder + reqObj.fpath;
            var absRootPath = path.resolve(rootFolder);
            var absFilePath = path.resolve(fullPath);

            // If the request was successfully parsed.
            if (reqObj.validRequest !== 'undefined' && reqObj.validRequest) {

                // If the request type was not GET or the file type requested is not supported, return 500.
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
                    var fs = require("fs");
                    fs.exists(fullPath, function(fileExists) {

                        // If the file requested does not exist, return 404.
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
                            // Read the requested file, create a response and send it to the socket.
                            fs.stat(fullPath, function(err, stat) {
                                var fileAsStream = fs.createReadStream(fullPath);
                                var pipeEvent;
                                console.log("200: file exists");
                                socket.write(reqObj.httpVer + " 200 OK\r\n");
                                socket.write("Connection: " + reqObj.connection + "\r\n");
                                socket.write("Content-Type: " + reqObj.fileTypeHtml + "\r\n");
                                socket.write("Content-Length: " + stat.size + "\r\n");
                                socket.write("\r\n");
                                pipeEvent = fileAsStream.pipe(socket);
                                // When the data finishes piping, close the connection if it needs to be closed.
                                pipeEvent.on('finish', function() {maintainConnection(reqObj.connection, reqObj.httpVer, socket);});
                            });
                        }
                    });
                    // If the socket has a keep-alive connection, re-set the timeout period.
                    if (reqObj.connection === "keep-alive") {
                        console.log("socket kept alive");
                        socket.setTimeout(2000);
                    }
                }
            }
        });
    };
    return this;
}

module.exports.Handler = Handler;