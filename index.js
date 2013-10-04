var df = require('dateformat');
var autonomy = require('ardrone-autonomy');
var arDrone = require('ar-drone');
var arDroneConstants = require('ar-drone/lib/constants');
var mission  = autonomy.createMission();

function navdata_option_mask(c) {
  return 1 << c;
}

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
    if (exiting) {
        process.exit(0);
    } else {
        console.log('Got SIGINT. Landing, press Control-C again to force exit.');
        exiting = true;
        mission.control().disable();
        mission.client().land(function() {
            process.exit(0);
        });
    }
});

// Connect and configure the drone
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', navdata_options);
mission.client().config('video:video_channel', 1);
mission.client().config('detect:detect_type', 12);

// Log mission for debugging purposes
mission.log("mission-" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");


/////


var controller = {
    start: function(altitude){
        mission.takeoff()
           .zero()               // Sets the current state as the reference
           .altitude(2);  // Climb to altitude in metres
        
        //mission.client().animate('flipLeft', 15);

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
        mission.hover(1000);

        mission.altitude(this.ALTITUDE_DRAW)
               .right(attr.width)
               .cw(90)
               .forward(attr.height)
               .cw(90)
               .left(attr.width)
               .cw(90)
               .backward(attr.height)
               .cw(90);

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
        mission.hover(1000);

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
            height: 2
        })
        .line({
            x1: 0,
            y1: 0,
            x2: 2,
            y2: 1
        });

    controller.end();
}

init();
