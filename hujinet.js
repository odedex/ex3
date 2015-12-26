var fs = require("fs");

function requestFileType (filename) {
    switch (filename.toLowerCase()) {
        case "jpg":
            return ["image/jpeg",false];
        case "jpeg":
            return ["image/jpeg",false];
        case "gif":
            return ["image/gif",false];
        case "js":
            return ["application/javascript",true];
        case "txt":
            return ["text/plain",true];
        case "css":
            return ["text/css",true];
        default:
            return ["text/html",true];
    }
}

function maintainConnection (connection, httpVer, socket) {
    console.log("in maintain connection"); //todo: delete this
    if (connection === "close" || (connection !== "keep-alive" && httpVer === "HTTP/1.0")) {
        socket.end();
    }
}

function Handler(socket, rootFolder) {
    var mySocket = socket;
    var myPath = rootFolder;
    var buffer = "";
    this.parseData = function (data) {
        //console.log ("data parse request"); //todo: delete this
        buffer += data;
        var splittedRequest = buffer.split("\r\n");

        //console.log(splittedRequest); //todo: delete this

        var requestType = splittedRequest[0].split(" ")[0];

        if (requestType !== "GET") {
            console.log("http header is not 'GET'.");
            socket.write(httpVer + " 500 Internal Server Error\n");
            socket.write("Content-Type: " + resultFileType[0] + "\n");
            socket.write("Content-Length: 0\n");
        }
        else {
            var fpath = splittedRequest[0].split(" ")[1];
            var fileType = fpath.split(".");
            var resultFileType;
            fileType = fileType[fileType.length - 1];
            resultFileType = requestFileType(fileType);
            var httpVer = splittedRequest[0].split(" ")[2];
            var connection = splittedRequest[2].split(": ")[1];
            //console.log(connection); //todo: delete this
            var afterResult;

            //console.log(httpVer); //todo: delete this

            fpath = rootFolder + fpath;

            fs.exists(fpath, function(fileExists) {
                if (!fileExists) {
                    console.log("file does not exist");
                    socket.write(httpVer + " 404 Not Found\n");
                    socket.write("Connection: " + connection + "\n");
                    socket.write("Content-Type: " + resultFileType[0] + "\n");
                    socket.write("Content-Length: 0\n");
                    maintainConnection(afterResult, httpVer, socket);
                }
                else {
                    fs.stat(fpath, function(err, stat) {
                        if (err) {
                            console.log("error stat'ing file after found file exists. should be unreachable.");
                            throw err;
                        }

                        else {
                            var fileAsStream = fs.createReadStream(fpath);
                            var pipeEvent;
                            console.log("file exists");
                            socket.write(httpVer + " 200 OK\n");
                            socket.write("Connection: " + connection + "\n");
                            socket.write("Content-Type: " + resultFileType + "\n");
                            socket.write("Content-Length: " + stat.size + "\n");
                            socket.write("\n");
                            pipeEvent = fileAsStream.pipe(socket);
                            pipeEvent.on('finish', function() {maintainConnection(afterResult, httpVer, socket);});
                        }
                    });
                }
            });
            if (connection === "keep-alive") {
                socket.setTimeout(2000);
            }
        }
    };

    return this;
}


module.exports.Handler = Handler;