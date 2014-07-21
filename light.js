//you can't just require lifx.  you need to init the lib
var lx = require("lifx").init();
var packet = require("lifx/packet");

//return the current epoch time 
//todo: change this to use hrtime
function getTimeOld() {
	return (new Date()).getTime();
}

function getTime() {
	var time = process.hrtime();
	var nanos = time[0] * 1e9 + time[1];
	var millis = parseInt(nanos / 1000000);
	return millis;
}

//get microseconds. 1s == 1000ms == 1,000,000  micros
function getMicrotime() {
	var time = process.hrtime();
	var nanos = time[0] * 1e9 + time[1];
	var micros = parseInt(nanos / 1000);
	return micros;

}


function waitFor(millis) {
	var start = getTime();
	var end = getTime();
	while( (end - start) < millis) {
		end = getTime();
	}
	//console.log("done waiting");
}

var started = false;

//wait for a bulb to be found 
lx.on("bulb", function(b1) {
	var count = 0,
		//the colors in our sequence (currently just red, green, blue)
		colors = [0xffff, 0x5555, 0xaaaa],
		timeStart  = getTime();

	console.log("bulb found:");
	console.dir(b1);

	//this function advances the light to the next color.  
	var lightHue = function() {
		started = true;
		var hue = colors[(count % colors.length)];
		lx.lightsColour(hue, 0xffff,     0xffff,    0xffff,   0, b1);
		count++
		if(count % 1000 === 0) {
			stats();
		}
	}

	//print out calculated pixels/sec 
	var stats = function() {
		var timeEnd = getTime();
		var timeDiff = (timeEnd - timeStart)/1000;
		console.log("colors cycled:%s  elapsedTime:%s  fps:%s", count, timeDiff.toFixed(2), (count/timeDiff).toFixed(2));
	}

	//waitFor(5000);
	setTimeout(lightHue, 1000);

//	console.log("time2: %s", getTime2());

	lx.on("packetsent", function() {
		//console.log("jimmy detected");
		if(started) {
			waitFor(15);
			lightHue();
		}
	})

	lx.on("rawpacket", function(pkt, rinfo) {
		console.log("rawpacket:");
		if(pkt.packetTypeShortName !== 'panGateway') {
			console.dir(pkt);
			
		}
		//console.dir(rinfo);
		//lightHue();
	});


});

