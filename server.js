var http = require("http");
var url = require("url");
var io = require('socket.io');
var socketserver = require('./socketserver');
var socket;

function start(route, handle) {

    function onRequest(request, response) {
        var postData="";
        var pathname=url.parse(request.url).pathname;
    //    console.log("Request for " + pathname + " received.");
        console.log("request:" + request);
        request.setEncoding("utf8");
        if (request.method == "GET")
        {
            console.log("GET Request")
           route(handle, pathname, response, request); 
        }
        else
        {
            request.addListener("data", function(postDataChunk){
              postData += postDataChunk;
             console.log("chunk received: '" + postDataChunk +"'.");
            })
            
            request.addListener("end",function(){
                console.log("end received");
                var data={"request" : request, "content" : postData}
                console.log(data);
                route(handle, pathname, response, data);
            })      
        }
    }

    var app = http.createServer(onRequest).listen(8888);
    console.log('Server started');
    socket = io.listen(app, {'log level': 1});
    socket.on('connection', socketserver.socketHandler);
    
    console.log('Socket server started');
}

exports.start = start;
