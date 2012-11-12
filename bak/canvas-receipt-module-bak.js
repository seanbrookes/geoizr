/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 11/11/12
 * Time: 12:17 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 07/11/12
 * Time: 11:33 PM
 * To change this template use File | Settings | File Templates.
 */
/**                                     ,
		displayCurrentUser:function(){
			displayCurrentUser();
		}
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 * To change this template use File | Settings | File Templates.
 */
var receiptinatorModule = (function(exports){
	_.templateSettings.variable = "G";
	var masterPixelArray = [];
	var pixelRowArray = [];
	var totalRows;
	var rowSize;

	function init(){
		$('.main-content-wrapper').load('modules/receiptinator/template.html',function(){
			console.log('receipt template loaded');
			// server load
//			$('.canvas-wrapper').load('/receipts',function(){
//				console.log('receipt get loaded');
//			});


			// crop zone
//			var cropzoom = $('#crop_container2').cropzoom({
//				width:400,
//				height:300,
//				bgColor: '#CCC',
//				enableRotation:true,
//				enableZoom:true,
//				zoomSteps:10,
//				rotationSteps:10,
//				expose:{
//					slidersOrientation: 'vertical',
//					zoomElement: '#zoom',
//					rotationElement: '#rotationContainer',
//					elementMovement:'#movement'
//				},
//				selector:{
//					centered:true,
//					borderColor:'blue',
//					borderColorHover:'yellow'
//				},
//				image:{
//					source:'/images/receiptinator/receipt-1.jpg',
//					width:1024,
//					height:768,
//					minZoom:50,
//					maxZoom:200,
//					startZoom:40,
//					useStartZoomAsMinZoom:true,
//					snapToContainer:true
//				}
//			});



			draw();


		});
	}
	function draw() {
		var canvas =  document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.onload = function(){
//			for (var i=0;i<4;i++){
//				for (var j=0;j<3;j++){
//					ctx.drawImage(img,j*50,i*38,50,38);
//				}
//			}
			// Move registration point to the center of the canvas
			//ctx.rotate(90);
			//ctx.translate(canvas.width/2, canvas.height/2);

			// Rotate 1 degree
			//ctx.rotate(4);

			// receipt-3 = 859 × 1900 pixels


			//ctx.drawImage(img, 0, 0, 859, 1900);

			var pixelArray = ctx.getImageData(0,0, img.width, img.height);

			var totalPixels = pixelArray.data.length;

			rowSize = totalPixels/img.height;

			console.log('TOTAL PIXELS: ' + totalPixels);
			console.log('ROW SIZE: ' + rowSize);

			totalRows = totalPixels/rowSize;
			console.log('TOTAL ROWS: ' + totalRows);

			//pixelArray = xRay(pixelArray);

			pixelArray = contrast(pixelArray);


			//ctx.putImageData(pixelArray, 0, 0);

//			ctx.drawImage(img,0,0);
//			ctx.beginPath();
//			ctx.moveTo(30,96);
//			ctx.lineTo(70,66);
//			ctx.lineTo(103,76);
//			ctx.lineTo(170,15);
//			ctx.stroke();
			$('.btn-display-pixels').click(function(event){
				var outputMarkup = '<h2>List</h2>';
				for (var i = 0;i < totalRows;i++){
					outputMarkup += '<p>Row[' + i + ']</p>';
				}
				$('.pixel-list').html(outputMarkup);
			});
		};
		img.src = '/images/receiptinator/receipt-3.jpg';
	}
	function xRay(pixels){
		var totalPixels = pixels.data.length;

		for (var i = 0;i < totalPixels;i += 4){
			pixels.data[i+0] = 255 - pixels.data[i+0];
			pixels.data[i+1] = 255 - pixels.data[i+2];
			pixels.data[i+2] = 255 - pixels.data[i+1];

		}
		return pixels;
	}
	function contrast(pixels){
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

			}
			masterPixelArray.push(pixelObj);
//			pixels.data[i+0] = 255 - pixels.data[i+0];
//			pixels.data[i+1] = 255 - pixels.data[i+2];
//			pixels.data[i+2] = 255 - pixels.data[i+1];

		}
		console.log('Pixel row count: ' + pixelRowArray.length);
		return pixels;
	}
	function colorToHex(color) {
		if (color.substr(0, 1) === '#') {
			return color;
		}
		var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

		var red = parseInt(digits[2]);
		var green = parseInt(digits[3]);
		var blue = parseInt(digits[4]);

		var rgb = blue | (green << 8) | (red << 16);
		return digits[1] + '#' + rgb.toString(16);
	}

	return{
		init:function(){
			return init();
		}
	};
}(window));