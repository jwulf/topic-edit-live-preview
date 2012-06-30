var http = require("http");
var url = require("url");

function start(route, handle) {

    function onRequest(request, response) {
        var postData="";
        var pathname=url.parse(request.url).pathname;
    //    console.log("Request for " + pathname + " received.");
            
        request.setEncoding("utf8");
            
        request.addListener("data", function(postDataChunk){
          postData += postDataChunk;
   //       console.log("chunk received: '" + postDataChunk +"'.");
        })
        
        request.addListener("end",function(){
    //        console.log("end received");
            route(handle, pathname, response, postData);
        })
        
        //route(handle, pathname, request, response);
        
        // http://stackoverflow.com/questions/8863179/enyo-is-giving-me-a-not-allowed-by-access-control-allow-origin-and-will-not-lo
        // http://www.wilsolutions.com.br/content/fix-request-header-field-content-type-not-allowed-access-control-allow-headers
        
       
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server Started");
}

exports.start = start;
