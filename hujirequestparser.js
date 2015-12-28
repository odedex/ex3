/**
 * Parses the file type into the appropriate html file type.
 * @param fileType File type to parse.
 * @returns {*[]} List with the file type, and boolean whether its a text file or not.
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
            return ["bad",false];
    }
}

/**
 * Function to parse an html request into a request object.
 * The function can handle the event which the header comes in multiple requests.
 * @param request Html request.
 * @param reqObj Object to populate.
 * @param callback Function to execute with the request object as parameter.
 */
module.exports.parseRequest = function(request, reqObj, callback) {
    if (request !== undefined) {
        var requestLines = request;
        requestLines = requestLines.toString().split("\r\n");
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
