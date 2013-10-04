var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();

var controller = {
    start: function(altitude){
        mission.takeoff()
           .zero()               // Sets the current state as the reference
           .altitude(altitude);  // Climb to altitude in metres

        return this;
    },

    end: function(){
        mission.land()
            .run(function (err, result) {
                if (err) {
                    console.trace("Oops, something bad happened: %s", err.message);
                    mission.client().stop();
                    mission.client().land();
                } else {
                    console.log("Mission success!");
                    process.exit(0);
                }
            });

        return this;
    }
};

var svg = {
    // x, y, width, height
    rect: function(attr){
        mission.go({
            x: attr.x,
            y: attr.y,
            z: 0.5,
            yaw:0
        });

        mission.altitude(2)
               .right(attr.width)
               .forward(attr.height)
               .left(attr.width)
               .backward(attr.height);

        return this;
    },

    // cx, cy, r
    circle: function(attr){

    },

    // x1, y1, x2, y2
    line: function(attr){

    },

    test: function(){
        var m = mission.takeoff()
           .zero()       // Sets the current state as the reference
           .altitude(2)  // Climb to altitude = 1 meter
           .forward(1)   
           .right(1)     
           .backward(1) 
           .left(1)
           //.hover(1000)  // Hover in place for 1 second
           .land();

        return this;
    }
};


/////


function init(){
    controller.start();
    svg.rect({
        x: 1,
        y: 1,
        width: 2,
        height: 3
    });
    controller.end();
}

init();
