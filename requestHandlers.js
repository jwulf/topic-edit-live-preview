var xslt = require('node_xslt');

function xmlPreview(response, request){
    
    console.log("xmlPreview handler called");
    var preview="<p>Could not transform</p>";
    console.log("Message was: " + request);
    //if (request !== "")
   // {
        var stylesheet = xslt.readXsltFile("/tmp/scratch/node.js-server/xsl/html-single.xsl");
        try
        {var xmldocument = xslt.readXmlString(request.toString());
        preview = xslt.transform(stylesheet, xmldocument, []);
        }
        catch (err) 
        {
            preview="<p>Could not transform</p>";
        }
        console.log("Transformed: " + preview);
         response.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        response.write(preview);
        response.end();
//    }
}

exports.xmlPreview=xmlPreview;