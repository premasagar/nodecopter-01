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

/////

var svg = {
    ALTITUDE_GO: 0.5,
    ALTITUDE_DRAW: 2,

    // x, y, width, height
    rect: function(attr){
        mission.go({
            x: attr.x,
            y: attr.y,
            z: this.ALTITUDE_GO,
            yaw: 0
        });

        mission.altitude(this.ALTITUDE_DRAW)
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
        mission.go({
            x: attr.x1,
            y: attr.y1,
            z: this.ALTITUDE_GO,
            yaw: 0
        });

        mission.go({
            x: attr.x2,
            y: attr.y2,
            z: this.ALTITUDE_DRAW,
            yaw: 0
        });

        return this;
    },

    test: function(){
        var m = mission.takeoff()
           .zero()       // Sets the current state as the reference
           .altitude(2)  // Climb to altitude in metres
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
        })
        .line({
            x1: 0,
            y1: 0,
            x2: 3,
            y2: 2
        });

    controller.end();
}

init();
