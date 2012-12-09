/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 02/12/12
 * Time: 11:16 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var url = require('url');

exports.postGeoCodeAddress = function(req, res){
	console.log('[GEOIZR]:getGeoCode');
};
exports.getGeoCode = function(req, res){
	var queryObject = url.parse(req.url,true).query;
	console.log(queryObject);
	var address = encodeURIComponent(queryObject.address);

	var pathPrefix = '/search?q=';
	var suffix = '&format=json';
	var queryVal = pathPrefix + address + suffix;

	var options = {
		host: 'nominatim.openstreetmap.org',
		path:  queryVal
	};

	callback = function(response) {
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});
		var responseObj = {};
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			try{
				var JSONRespObj = JSON.parse(str);
				var firstAddress = JSONRespObj[0];
				responseObj.lon = firstAddress.lon;
				responseObj.lat = firstAddress.lat;
			}
			catch(e){
				console.log('Geocode error: ' + e.message);
				responseObj = {};

			}
			res.send(responseObj);
		});
	}

	http.request(options, callback).end();
};