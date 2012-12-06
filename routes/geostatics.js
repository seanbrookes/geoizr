/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 16/10/12
 * Time: 11:16 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * post geostatic data
 *
 * @param req
 * @param res
 */

var mongoose = require('mongoose');
//console.log('END CONNECTION BLOCK');
var Schema = mongoose.Schema;

var Geostatic = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    point: [Number, Number],
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});
var Activity = new Schema({
    title: { type: String, required: true },
    actor:{type:String},
    activity:{type:String},
    objects:{type:Array},
    description: { type: String, required: false },
    created: { type: Date, default: Date.now }
});
var GeostaticModel = mongoose.model('Geostatic', Geostatic);

exports.postGeoCodeAddress = function(req, res){
	console.log('[GEOIZR]:getGeoCode');
};
exports.getGeoCode = function(req, res){
	console.log('[GEOIZR]:getGeoCode http://nominatim.openstreetmap.org/search?q=34910+brient+dr,+Mission,+BC&format=json');
	res.send('[GEOIZR]:getGeoCode http://nominatim.openstreetmap.org/search?q=34910+brient+dr,+Mission,+BC&format=json');
};
exports.newGeostatic = function(req, res){
    console.log('--------------------------------');
    console.log('|[exports.newGeostatic]   exports.newGeostatic   A');
    console.log('--------------------------------');

    var geostatic;

    if(req.body){



        if (req.body.lat){
            console.log('[exports.newGeostatic] New Geostatic: ');
            /*
             we have a successful geostatic post object from the browser (map app)

             save it to the db
             - post for new
             - put for update
             */
            //var





            console.log('[exports.newGeostatic] we have lat:  ' + req.body.lat);
            console.log('[exports.newGeostatic] we have lng:  ' + req.body.lng);


            console.log('[exports.newGeostatic] POST: ');
            console.log('[exports.newGeostatic] req.body: ' + req.body);
            console.log('[exports.newGeostatic] 1');

            var geostaticName = '', geostaticDescription = '';
            console.log('2');
            if (req.body.name){
                geostaticName: req.body.name;
            }
            console.log('3');
            if (req.body.description){
                geostaticDescription: req.body.description;
            }
            console.log('4');

            geostatic = new GeostaticModel({
                point: [req.body.lng,req.body.lat],
                name: geostaticName,
                description: geostaticDescription
            });
            console.log('5');
            geostatic.save(function (err) {

                if (!err) {
                    console.log('[exports.newGeostatic] Geosatic model created: ' + geostatic);
                    res.send(geostatic);

                } else {
                    console.log('[exports.newGeostatic] save Geosatic model failed: ' + err);
                }

            });
            console.log('6');
            GeostaticModel.find(function(err,geostatic){
                if(err){
                    console.log('[exports.newGeostatic] read geostatic instance error: ' + err);
                }
                else{
                    console.log('[exports.newGeostatic] geostatic instance: ' + geostatic);
                }
            });
            console.log('7');
            //res.send(geostatic);
        }
        else{
            console.log('[exports.newGeostatic] we have no lat:  ');

        }
       // mongoose.connection.close();
    }
    else{
        console.log('[exports.newGeostatic] no body:  ');

    }
    console.log('[exports.newGeostatic] DONE  - Posted geostatic: ' + req.body.lat + ' ' + req.body.lng + '  Geostatic: ' + geostatic );
    console.log('|[exports.newGeostatic] -------------------------------------------');
    console.log('|');
    console.log('|');
    console.log('|');
    console.log('|[exports.newGeostatic] ');
};
/**
 *
 * Get Geostatics
 *
 *
 * @param req
 * @param res
 * @return {*}
 */
exports.getGeostatics = function(req,res){
    console.log('|[exports.getGeostatics] ');
    console.log('|[exports.getGeostatics] stRT exports.getGeostatics');

    return GeostaticModel.find(function(err, geostatics) {
        console.log('|[exports.getGeostatics] stRT exports1');
        if (!err) {
            console.log('[exports.getGeostatics] return GeostaticModel collection: ' + geostatics);

            return res.send(geostatics);
        } else {
            console.log('|[exports.getGeostatics] stRT 2');
            return console.log(err);
        }
    });


};
/**
 *
 * Get Geostatic
 *
 *
 * @param req
 * @param res
 * @return {Query}
 */
exports.getGeostatic = function(req,res){
    return GeostaticModel.findById(req.params.id, function(err, geostatic) {
        if (!err) {
            console.log('[exports.getGeostatic] RETURNING GEOSTATIC: ' + req.params.id);
            return res.send(geostatic);
        } else {
            return console.log(err);
        }
    });
};
/**
 *
 * Update Geostatic
 *
 * @param req
 * @param res
 * @return {Query}
 */
exports.updateGeostatic = function(req, res){
    return GeostaticModel.findById(req.params.id, function (err, geostatic) {
        geostatic.name = req.body.name;
        geostatic.pos = [req.body.lng,req.body.lat];
        geostatic.description = req.body.description;
        geostatic.modified = Date.now();
        return geostatic.save(function (err) {
            if (!err) {
                console.log('[exports.updateGeostatic] updated');
            } else {
                console.log(err);
            }
            return res.send(geostatic);
        });
    });
};
/**
 *
 * Delete Geostatic
 *
 * @param req
 * @param res
 * @return {Query}
 */
exports.deleteGeostatic = function(req, res){
    return GeostaticModel.findById(req.params.id, function (err, geostatic) {
        return geostatic.remove(function (err) {
            if (!err) {
                console.log('[exports.deleteGeostatic] deleted');
            } else {
                console.log(err);
            }
            return res.send(req.params.id);
        });
    });
};
