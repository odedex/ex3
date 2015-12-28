/**
 * Created by OdedA on 20-Dec-15.
 */

function requestFileType (fileType) {
    switch (fileType.toLowerCase()) {
        case "jpg":
            return ["image/jpeg",false];
        case "jpeg":
            return ["image/jpeg",false];
        case "gif":
            return ["image/gif",false];
        case "png":
            return["image/png",false];
        case "html":
            return["text/html",true];
        case "htm":
            return["text/html",true];
        case "js":
            return ["application/javascript",true];
        case "txt":
            return ["text/plain",true];
        case "css":
            return ["text/css",true];
        default:
            return ["bad",true];
    }
}

module.exports.parseRequest = function(request, reqObj, callback) {
    //console.log("request:"); //todo: delete this
    //console.log(request); //todo: delete this
    if (request !== undefined) {
        var requestLines = request;
        requestLines = requestLines.toString().split("\r\n");
        //console.log("\r\nin request parser. parsed lines:"); //todo: delete this
        //console.log(requestLines); //todo: delete this
        if (typeof (reqObj.requestType) === 'undefined') {
            try {
                var temp;
                reqObj.requestType = requestLines[0].split(" ")[0];
                reqObj.fpath = requestLines[0].split(" ")[1];
                temp = reqObj.fpath.split(".");
                reqObj.fileType = temp[temp.length - 1];
                reqObj.fileTypeHtml = requestFileType(reqObj.fileType);
                reqObj.httpVer = requestLines[0].split(" ")[2];
            }
            catch (e) {
                reqObj.requestType = "";
            }
        }
        if (reqObj.connection === "undefined") {
            reqObj.connection = "";
        }
        requestLines.forEach(function(line) {
            if (line.indexOf("Connection") > -1) {
                reqObj.connection = line.split(" ")[1];
            }
            if (line === "") {
                reqObj.validRequest = true;
            }
        });
    }
    callback(reqObj);


};
