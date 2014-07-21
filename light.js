//you can't just require lifx.  you need to init the lib
var lx = require("lifx").init();

//return the current epoch time 
//todo: change this to use hrtime
function getTime() {
	return (new Date()).getTime();
}


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

	setInterval(lightHue, 1);

});

