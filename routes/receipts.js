/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 11/11/12
 * Time: 7:46 AM
 * To change this template use File | Settings | File Templates.
 */
//var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var EventBus = new EventEmitter();
var masterPixelArray = [];
var pixelRowArray = [];
var totalRows;
var rowSize;


exports.getCanvas = function(req, res){
	console.log('[exports.getCanvas] start');
	function createCanvas(){
		var Canvas = require('canvas')
			, canvas = new Canvas(150, 150)
			, ctx = canvas.getContext('2d')
			, fs = require('fs');

		ctx.fillRect(0,0,150,150);   // Draw a rectangle with default settings
		ctx.save();                  // Save the default state

		ctx.fillStyle = '#09F';       // Make changes to the settings
		ctx.fillRect(15,15,120,120); // Draw a rectangle with new settings

		ctx.save();                  // Save the current state
		ctx.fillStyle = '#FFF';       // Make changes to the settings
		ctx.globalAlpha = 0.5;
		ctx.fillRect(30,30,90,90);   // Draw a rectangle with new settings

		ctx.restore();               // Restore previous state
		ctx.fillRect(45,45,60,60);   // Draw a rectangle with restored settings

		ctx.restore();               // Restore original state
		ctx.fillRect(60,60,30,30);   // Draw a rectangle with restored settings
		console.log('[exports.getCanvas] start');

		try{
			var out = fs.createWriteStream('./public/modules/receipt/state.png');
			console.log('[exports.getCanvas] success create out variable');
		}
		catch(e){
			console.log('[exports.getCanvas] error creating image: ' + e.message);
		}
		var stream = canvas.createPNGStream();

		stream.on('data', function(chunk){
			out.write(chunk);
		});
		//res.end('<img src="/modules/receipt/state.png">');
	}
	function initCanvas(){
		var Canvas = require('canvas')
			, canvas = new Canvas(1900, 859)
			, ctx = canvas.getContext('2d')
			, fs = require('fs');
		masterPixelArray = [];
		//var canvas =  document.getElementById('canvas');
		//var ctx = canvas.getContext('2d');


		fs.readFile('./public/images/receipt/receipt-3.jpg', function(err, data) {
		//img.onload = function(){
			if(!err){


			var img = new Canvas.Image();
			img.src = data;

			//console.log('DATA:  ' + data + '');

			//ctx.drawImage(img, 0, 0, 859, 1900);

			var pixelArray = ctx.getImageData(0,0, img.width, img.height);

			var totalPixels = pixelArray.data.length;

			rowSize = totalPixels/img.height;

			console.log('TOTAL PIXELS: ' + totalPixels);
			console.log('ROW SIZE: ' + rowSize);

			totalRows = totalPixels/rowSize;
			console.log('TOTAL ROWS: ' + totalRows);

			//pixelArray = xRay(pixelArray);

			// pixelArray = contrast(pixelArray);
			console.log('[exports.getCanvas] before processPixels ');
			setTimeout(processPixels(pixelArray), 250);
			//var pixelArray2 = setTimeout(processPixels, 250);
			console.log('[exports.getCanvas] after processPixels ');


			//pixelArray = processPixels(pixelArray);


//			$('.btn-display-pixels').click(function(event){
//				var outputMarkup = '<h2>List</h2>';
//				for (var i = 0;i < totalRows;i++){
//					outputMarkup += '<p>Row[' + i + ']</p>';
//				}
//				$('.pixel-list').html(outputMarkup);
//			});

			}
			else{
				console.log('exports.getCanvas THERE WAS AN ERROR: ' + err);
			}
		});

		EventBus.on('processPixels', function(pixels) {
			console.log('processed pixels event lisetener: ' + pixels.length);
			res.end(JSON.stringify({totalPixelObj:pixels}));
		});

		//img.src = '/images/receipt/receipt-3.jpg';
	}
	function processPixels(pixels){
		pixelRowArray = [];
		console.log('[exports.getCanvas] start processPixels ');
		// start spinner
		//var pixels = pixelArray;
		var totalPixels = pixels.data.length;

		var tempRowArray = [];
		var tempRowArrayIndex = 0;

		for (var i = 0;i < totalPixels;i += 4){
			var pixelRedSrcVal = pixels.data[i+0];
			var pixelGreenSrcVal = pixels.data[i+1];
			var pixelBlueSrcVal = pixels.data[i+2];
			var pixelSaturationValue = pixelRedSrcVal + pixelGreenSrcVal + pixelBlueSrcVal;
			var rgbColorValString = 'rgb(' + pixelRedSrcVal + ', ' + pixelGreenSrcVal + ', ' + pixelBlueSrcVal + ')';

			var pixelObj = {
				pixelId:i,
				pixelSaturation:pixelSaturationValue,
				//pixelColor:colorToHex(rgbColorValString)
				pixelColor:{
					red:pixelRedSrcVal,
					green:pixelGreenSrcVal,
					blue:pixelBlueSrcVal
				}
			};
			tempRowArray.push(pixelObj);
			tempRowArrayIndex++;
			if(tempRowArrayIndex === rowSize){
				pixelRowArray.push(tempRowArray);
				tempRowArrayIndex = 0;
				tempRowArray = [];
				console.log('New Row: ' + pixelRowArray.length);
			}
			masterPixelArray.push(pixelObj);
//			pixels.data[i+0] = 255 - pixels.data[i+0];
//			pixels.data[i+1] = 255 - pixels.data[i+2];
//			pixels.data[i+2] = 255 - pixels.data[i+1];
			//console.log('[exports.getCanvas] end processPixels ')

		}
		console.log('Pixel row count: ' + pixelRowArray.length);

		EventBus.emit('processPixels', masterPixelArray);
		// end spinner
		//return pixels;
	}
	setTimeout(initCanvas, 250);
	setTimeout(createCanvas, 250);

//	createCanvas();
//	initCanvas();
};