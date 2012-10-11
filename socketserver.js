var fs=require('fs');
var spawn = require('child_process').spawn;
var carrier = require('carrier');

function socketHandler(client){
    var cmd_running = false;
    console.log('Client connected');
    client.send('{"success": 1}');
    client.on('msg', function(data) {
        console.log('Client just sent:', data); 
    }); 
    client.on('pushspec', function(data) {
        console.log('Received content spec push request');
        if (!cmd_running){
            cmd_running = true;
            var filenumber=1;
            while (fs.existsSync("/tmp/cspec"+ filenumber))
                filenumber++;
            var filename="/tmp/cspec"+filenumber;

            console.log('Creating local file: ' + filename);
            console.log('Client pushed: ' + data);
            
            fs.writeFile(filename, data.spec, function(err){
                if(err) {
                        console.log(err);
                        client.emit('cmdoutput', 'Failed to create file on server');
                        cmd_running = false;
                } else {
                    console.log("Saved spec file" + filename);
                    var command = 'csprocessor';
                    var server = data.server;
                    client.emit('cmdstart','started');
                    console.log('Commencing push operation');
                    var push = spawn(command, ['push','-u', 'jwulf', '-H', server, filename]);
                    push.stdout.setEncoding('utf8');
                    // add a 'data' event listener for the spawn instance
                    var linereader = carrier.carry(push.stdout);
                    linereader.on('line', function(line){client.emit('cmdoutput',line); console.log(line); });
                 
                    //push.stdout.on('data', function(data) { client.emit('cmdoutput',data); console.log(data); });
                    // add an 'end' event listener to close the writeable stream
                    push.stdout.on('end', function(data) {
                        client.emit('cmdfinish','done');
                    });
                    // when the spawn child process exits, check if there were any errors 
                    push.on('exit', function(code) {
                        client.emit('cmdexit', code);
                        cmd_running = false;         
                        fs.unlink(filename, function(err)
                        {
                            if (err) {console.log(err);}
                            else{console.log("Successfully deleted "+ filename);}
                        });
                    });
                }
            });
            
        }
    });
        
    client.on('disconnect', function() {
        console.log('Bye client :(');
    }); 
}

exports.socketHandler = socketHandler;