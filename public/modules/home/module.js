/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 01/11/12
 * Time: 9:45 PM
 * To change this template use File | Settings | File Templates.
 */
var homeModule = (function(){
    _.templateSettings.variable = "G";

    // Grab the HTML out of our template tag and pre-compile it.

    /**
     * Initialize
     *
     */
    var initialize = function() {

        $('.main-content-wrapper').load('modules/home/template.html',function(){
            console.log('hello world');
            var map2 = new mxn.Mapstraction('map2', 'googlev3');

            var latlon = new mxn.LatLonPoint(39.74,-104.98);
            map2.setCenterAndZoom(latlon, 10);
        });

    }




    return{
        init:function(){
            return initialize();
        }
    };

}());
