/**
 * start the webserver
 * @param port Port number to open the server on.
 * @param rootFolder Path to the root folder of the server.
 * @param callback Call at the end of the function.
 * @returns {ServerObj} Server object.
 */
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

    // If folder path is ok, create a new server object and return it.
    var serverObj = new ServerObj(port, rootFolder, callback);
    serverObj.startServer(callback);
    return serverObj;
};

/**
 * Constructor function for the server object.
 * Decides all socket behaviour of sockets connecting to the server.
 * @param port Port the server listens to.
 * @param rootFolder Root folder of the server.
 * @returns {ServerObj} Server object.
 * @constructor
 */
function ServerObj(port, rootFolder, callback){
    var net = require("net");
    var serverPort = port;
    var serverFolder = rootFolder;
    var serverStarted = false;

    // Change server port and folder to be read only.
    Object.defineProperty(this, "serverPort", {writeable: false, readable: true});
    Object.defineProperty(this, "serverFolder", {writeable: false, readable: true});

    // Create the server.
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

        socket.on("end", function () {
            console.log("socket closed");
        });

        socket.on("hangup", function() {
            console.log("in hang up");
        });
    });

    this.server.on("error", function (err) {
        console.log("Server encountered error: " + err);
        callback(err);

    });

    this.close = function(callback) {
        this.server.close(callback);
    };

    this.startServer = function(callback) {
        serverStarted = true;
        this.server.listen(port, function() {
            callback();
        })
    };

    this.stop = function stop(callback) {
        console.log("server stopped");
        if (serverStarted) {
            this.server.close(callback);
        }
        else {
            console.log ("requested close for already closed server");
        }
    };

    return this;
}
