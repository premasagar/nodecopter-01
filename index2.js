var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();

mission.takeoff()
       .zero()       // Sets the current state as the reference
       .altitude(2)  // Climb to altitude = 1 meter
       
              
       
       .forward(1.5)
       .cw(90)  
       
       .forward(1.5)
       .cw(90)         
       
       .forward(1.5)     
       .cw(-90)
       
       .forward(1.5)
       .cw(-90)  
       
       .forward(1.5)
       .cw(-90)   
       
       .altitude(3)
       .left(0.5)
       .right(0.5)
       
       .altitude(1)
       .cw(90)   
       .cw(90)   
       .cw(90)   
       .cw(90)     
       
       .hover(20)  // Hover in place for 1 second
       .land();

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