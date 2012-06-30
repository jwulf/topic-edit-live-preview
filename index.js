var server=require("./server");
var router=require("./router");
var requestHandlers=require("./requestHandlers");

var handle={};

// Create the handlers object for the router
handle["/xmlpreview"] = requestHandlers.xmlPreview;

// Start the server with a router, and a handlers object for the router
server.start(router.route, handle);
