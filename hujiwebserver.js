module.exports.start = function (port, rootFolder, callback) {
    var fs = require("fs");

    fs.stat(rootFolder, function (err, stats) {
        if (err) {
            callback(new Error("Root folder path does not exist."));
            return null;
        }
        if (!stats.isDirectory()) {
            callback(new Error("Root folder path is not a folder."));
            return null;
        }
    });

    var serverObj = new ServerObj(port, rootFolder);
    serverObj.startServer(callback);
    return serverObj;
};

function ServerObj(port, rootFolder){
    var net = require("net");
    var serverPort = port;
    var serverFolder = rootFolder;
    Object.defineProperty(this, "serverPort", {writeable: false, readable: true});
    Object.defineProperty(this, "serverFolder", {writeable: false, readable: true});

    this.server = net.createServer(function(socket) {
        console.log ("new client on server");
        var hujinet = require("./hujinet.js");
        var handler = new hujinet.Handler(socket, rootFolder);

        socket.setTimeout(2000);

        socket.on("connect", function(data) {
            console.log ("new socket is connected");
        });

        socket.on("data", function(data) {
            handler.parseData(data);
        });

        socket.on("timeout", function() {
            console.log("socket timed out");
            socket.end();
        });

        socket.on("uncaughtException", function(err) {
            console.log("uncaught exception");
            console.log(err);
        });

        socket.on("error", function(err){
            console.log("socket error caught");
            callback(new Error(err.errno))
        });
    });

    this.close = function(callback) {
        this.server.close(callback);
    };

    this.startServer = function(callback) {
        this.server.listen(port, function() {
            //console.log("server is live"); //todo: delete this
            callback();
        })
    };

    return this;
}
