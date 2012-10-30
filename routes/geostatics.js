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
console.log('START CONNECTION BLOCK');
mongoose.connect('mongodb://localhost:27017/geostatics',function(err){
    if(err){
        console.log('--------------------------------');
        console.log('Hello Connection ERROR : ' + err);
        console.log('--------------------------------');
    }
    else{
        console.log('Connected to MONGO!!!!!!!!!!!!!!!!');
    }
});
console.log('END CONNECTION BLOCK');
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

exports.newGeostatic = function(req, res){
    console.log('--------------------------------');
    console.log('|   exports.newGeostatic   A');
    console.log('--------------------------------');

    var geostatic;

    if(req.body){



        if (req.body.lat){
            console.log('New Geostatic: ');
            /*
             we have a successful geostatic post object from the browser (map app)

             save it to the db
             - post for new
             - put for update
             */
            //var





            console.log('we have lat:  ' + req.body.lat);
            console.log('we have lng:  ' + req.body.lng);


            console.log("POST: ");
            console.log('req.body: ' + req.body);
            console.log('1');

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
                    console.log("Geosatic model created");

                } else {
                    console.log('save Geosatic model failed: ' + err);
                }

            });
            console.log('6');
            GeostaticModel.find(function(err,geostatic){
                if(err){
                    console.log('read geostatic instance error: ' + err);
                }
                else{
                    console.log('geostatic instance: ' + geostatic);
                }
            });
            console.log('7');
            //res.send(geostatic);
        }
        else{
            console.log('we have no lat:  ');

        }
       // mongoose.connection.close();
    }
    else{
        console.log('no body:  ');

    }
    console.log('DONE  - Posted geostatic: ' + req.body.lat + ' ' + req.body.lng + '  Geostatic: ' + geostatic );
    console.log('|-------------------------------------------');
    console.log('|');
    console.log('|');
    console.log('|');
    console.log('|');
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
    console.log('|');
    console.log('|stRT exports.getGeostatics');

    return GeostaticModel.find(function(err, geostatics) {
        console.log('|stRT exports1');
        if (!err) {
            console.log('return GeostaticModel collection: ' + geostatics);

            return res.send(geostatics);
        } else {
            console.log('|stRT 2');
            return console.log(err);
        }
        console.log('|stRT exports 3');
    });
    console.log('|stRT exports4');

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
                console.log("updated");
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
                console.log("deleted");
            } else {
                console.log(err);
            }
            return res.send(req.params.id);
        });
    });
};
