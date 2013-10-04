var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.disableEmergency();

var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();

//function test(){
    mission.takeoff()
           .zero()       // Sets the current state as the reference
           .altitude(1)  // Climb to altitude = 1 meter
           .forward(2)   
           .right(2)     
           .backward(2) 
           .left(2)
           .hover(1000)  // Hover in place for 1 second
           .land();
//}

function start(altitude){
    console.log("start");
    mission.takeoff()
           .zero()               // Sets the current state as the reference
           .altitude(altitude);  // Climb to altitude = 2 metres
}

function end(){
    console.log("end");
    mission.land();
}

function rect(x, y, width, height){
    console.log("rect");
    mission.go({x:x, y:y, z:0, yaw:0})
           .right(width)
           .forward(height)
           .left(width)
           .backward(height);
}

function init(){
    start(2);
    rect(1, 1, 3, 2);
    end();
}

mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("Mission success!");
        process.exit(0);
    }
});

init();
