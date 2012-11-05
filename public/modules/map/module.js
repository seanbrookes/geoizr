/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 29/10/12
 * Time: 9:51 PM
 * To change this template use File | Settings | File Templates.
 *
 *
 *
 * notes:
 *
 * 22300 River Road Maple Ridge BC
 * 22934 Vista Ridge Dr. Maple Ridge BC
 *
 *
 */
var mapModule = (function(){
    _.templateSettings.variable = "G";
    var mainMap,
        map,
        map2,
        currentMarkers = [];
    var bIsInit = false;


    // Grab the HTML out of our template tag and pre-compile it.

    function initMap(callbackArg){
        var initFunc = callbackArg;
        if (!bIsInit){
            $('.main-content-wrapper').load('modules/map/template.html',function(callback){
                map2 = new mxn.Mapstraction('map_canvas', 'googlev3');
                var args = { pan:	 true, zoom:	 'large' || 'small', overview: true, scale:	true, map_type: true, }
                map2.addControls(args);
                map2.autoCenterAndZoom();
                map2.click.addHandler(function(event_name, event_source, event_args){
                    //map2.addEventListener('click',function(clickpoint){
                    var a = event_name;
                    var b = event_source;
                    var c  = event_args;
                    console.log('latitude' + c.location.lat + '\nlongitude: ' + c.location.lon);
                    if (confirm('add new marker here?')){
                        // var marker = new mxn.Marker(new mxn.LatLonPoint(c.location.lat, c.location.lon));
                        // map2.addMarker(marker);
                        // map.setCenter(event.latLng);
                        placeMarker({name:c.name,location:c.location});

                    }
                });

                bIsInit = true;
                if (initFunc){
                    initFunc();
                }
            });
        }
    }
    /**
     * Initialize
     *
     */
    function initialize(){

        //$('.main-content-wrapper').load('modules/map/template.html',function(){
            //var currentPosition = navigator.geolocation.getCurrentPosition(renderMap);
            //map2 = new mxn.Mapstraction('map_canvas', 'googlev3');

        if (bIsInit){
            var currentPosition = navigator.geolocation.getCurrentPosition(function(position){
                console.log('Get current location');

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var latlon = new mxn.LatLonPoint(lat,lng);
                map2.setCenterAndZoom(latlon, 10);

                var currentLocMarker = new mxn.Marker(latlon);
                //currentLocMarker.setInfoBubble(locationObj.name);
                map2.addMarker(currentLocMarker);

//
//                map2.click.addHandler(function(event_name, event_source, event_args){
//                //map2.addEventListener('click',function(clickpoint){
//                    var a = event_name;
//                    var b = event_source;
//                    var c  = event_args;
//                    console.log('latitude' + c.location.lat + '\nlongitude: ' + c.location.lon);
//                    if (confirm('add new marker here?')){
////                        var marker = new mxn.Marker(new mxn.LatLonPoint(c.location.lat, c.location.lon));
////                        map2.addMarker(marker);
//                        placeMarker({name:c.name,location:c.location});
//                    }
//                });

            });



        }
        else{
            console.log('Initialize Called but map is not initialized');
        }
        //});

    }
    /**
     * Load Geostatics List
     *
     */
    function loadGeostaticList(){
        /**
         *
         *  Get all geostics
         *  run on page load
         *
         *
         */
//        var template = _.template( $("#tTemplate").html(), {} );

        $.ajax({
            type: 'GET',
            url: '/geostatics',
            success: function(response){
                var outputString;
                $.each(response, function(item) {
                    outputString += '<li data-id="' + this._id + '" class="geostatic-container">';
                    if (this.name){
                        outputString += '<p class="geostatic-item-display-name"><a data-id="' + this._id + '" class="cmd-point-name" href="#point/' + this._id + '">' + this.name + '</a></p>';

                    }
                    outputString += '<a data-id="' + this._id + '" class="cmd-point-name" href="#point/' + this._id + '">' + this.point[0] + ' | ' + this.point[1] + '</a></li>';
                    var targetPoint = {};
                    targetPoint.coords = {};
                    targetPoint.location = {};
                    targetPoint.location.lat = this.point[1];
                    targetPoint.location.lng = this.point[0];
                    targetPoint.coords.latitude = this.point[1];
                    targetPoint.coords.longitude = this.point[0];
                    currentMarkers.push(targetPoint);
                    //addPointToMap(targetPoint);
                });

                // var stringifiedOutput = JSON.stringify(response);
                var stringifiedOutput = response;
                console.log('successful get geostatics');
                $('.list-coords').html(outputString);
                $('.cmd-point-name').contextMenu({
                        menu: 'myMenu'
                    },
                    function(action, el, pos) {
                        console.log('click menu: ' + action + '  id: '  + $(el).attr('data-id') );
                        /**
                         * Delete point
                         */
                        if (action === 'delete'){
                            if (confirm('confirm delete point: ' + this.name)){
                                console.log('DELETE POINT');
                                /**
                                 *
                                 * Update the Geostatic
                                 *
                                 */
                                $.ajax({
                                    type: 'DELETE',
                                    url: '/geostatics/' + $(el).attr('data-id'),
                                    data:{},
                                    dataType: 'application/x-www-form-urlencoded',
                                    success: function(data){
                                        var outputstring;

                                        //console.log('successful delete geostatic:  ' + JSON.stringify(data));
                                        console.log('successful delete geostatic:  ' + data);
                                        loadGeostaticList();
                                    },
                                    error: function(response){
                                        var resStatus = response.status + '';
                                        if (resStatus.substring(0,1) === '2'){
                                            loadGeostaticList();
                                            console.log('success delete with err function call delete!?!?!? ' + response);
                                        }

                                        console.log('fail delete: ' + response);
                                    }
                                });




                            }
                        }
                        /**
                         * Edit point
                         *
                         */
                        if (action === 'edit'){
                            // get the geostatic from the backend
                            // load in the form
                            // show the form

                            /**
                             *
                             * Edit the Geostatic
                             *
                             */
                            $.ajax({
                                type: 'GET',
                                url: '/geostatics/' + $(el).attr('data-id'),
                                success: function(data){
                                    var outputstring;
                                    var template = _.template(
                                        $( "#tTemplate" ).html()
                                    );
                                   // var test = JSON.parse(data);
                                    console.log('successful get geostatic:  ' + data);

                                    var templateOut = $("#tTemplate").html();
                                    $(el).after(template( data ));
                                    $('.btn-cancel').click(function(event){
                                        $('.point-form').hide();
                                        event.preventDefault();
                                    });
                                    $('.btn-save').click(function(event){
                                        var dataObj = {};
                                        data.name = $('.point-form #name').val();
                                        data.description = $('.point-form #description').val();
                                        /**
                                         *
                                         * Update the Geostatic
                                         *
                                         */
                                        $.ajax({
                                            type: 'PUT',
                                            url: '/geostatics/' + $(el).attr('data-id'),
                                            data:data,
                                            dataType: 'application/x-www-form-urlencoded',
                                            success: function(data){
                                                var outputstring;

                                                console.log('successful put geostatic:  ' + data);
                                                //console.log('successful put geostatic:  ' + JSON.stringify(data));
                                                loadGeostaticList();
                                            },
                                            error: function(response){
                                                var resStatus = response.status + '';
                                                if (resStatus.substring(0,1) === '2'){
                                                    loadGeostaticList();
                                                    console.log('success put with err function call!?!?!? ' + response);
                                                }

                                                console.log('fail put: ' + response);
                                            }
                                        });
                                        $('.point-form').hide();
                                        event.preventDefault();
                                    });
                                },
                                error: function(){
                                    console.log('fail get');
                                }
                            });




                        }
                    }
                );
            },
            error: function(){
                console.log('fail get');
            }
        });
    }
    /**
     * Find Address
     *
     * @param address
     * @return {*}
     */
    function findAddress(address) {
        // var address = [
        //   street,
        //   city.toLowerCase(),
        //   state.toLowerCase(),
        //   zip
        // ].join(', ');
        var result;
        var geocoder;
        if (!geocoder) {
            geocoder = new google.maps.Geocoder();
        }

        geocoder.geocode( { 'address': address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                result = results[0].geometry.location;


                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                console.log(result);

                console.log(result.toString());

                //console.log(result[0][0]);

            } else {
                result = "Unable to find address: " + status;
                console.log(result);
            }
        });

        return result;
    }







    /**

     PLACE MARKER ON THE MAP


     */
    function placeMarker(locationObj) {
//        var marker = new google.maps.Marker({
//            position: location,
//            map: map
//        });
        console.log('Place new location: ' + locationObj.location);


        var marker = new mxn.Marker(new mxn.LatLonPoint(locationObj.location.lat, locationObj.location.lon));
        marker.setInfoBubble(locationObj.name);
        map2.addMarker(marker);

        var latlon = new mxn.LatLonPoint(locationObj.location.lat, locationObj.location.lon);
        map2.setCenterAndZoom(latlon, 10);



        var x = location.lat;
        var y = location.lon;
        var p = '{lat:"' + x + '",lng:"' + y + '"}';
        var obj = {};
        obj.lat = x;
        obj.lng = y;
        //var pxa = JSON.(location);

        /**
         *
         * Add a new Geostatic
         *
         */
        $.ajax({
            type: 'POST',
            url: '/geostatics',
            data:obj,
            success: function(response){
                console.log('successful post');
                var procObj = JSON.parse(response.responseText);
                document.location.href = '#point/' + procObj._id;
                loadGeostaticList();
            },
            error: function(response){
                if (response.status === 200){
                    var procObj = JSON.parse(response.responseText);
                    console.log('success error post new location');
                    document.location.href = '#point/' + procObj._id;
                    loadGeostaticList();
                }
                else{
                    console.log('err post new location');

                }
            },
            dataType: 'application/json'
        });

    }

    /**
     * Render Map
     *
     * @param position
     */
    function renderMap(position) {

        $('.main-content-wrapper').load('modules/map/template.html',function(){
            //var currentPosition = navigator.geolocation.getCurrentPosition(renderMap);
            map2 = new mxn.Mapstraction('map_canvas', 'googlev3');

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var latlon = new mxn.LatLonPoint(lat,lng);
            map2.setCenterAndZoom(latlon, 10);

            var currentLocMarker = new mxn.Marker(latlon);
            currentLocMarker.setInfoBubble(position.name);
            map2.addMarker(currentLocMarker);





        });


    }
    function addPointToMap(loc){
        var latlon = new mxn.LatLonPoint(loc.location.lat,loc.location.lng);

        var locMarker = new mxn.Marker(latlon);
        //currentLocMarker.setInfoBubble(position.name);
        map2.addMarker(locMarker);
    }
    function renderPoint(id){
        var isPointCached = false;
        // if the point has not been rendered yet then get it from the db first
        if (!isPointCached){
            $.ajax({
                type: 'GET',
                url: '/geostatics/' + id,
                success: function(data){
//                    var positionObj = {};
//                    positionObj.coords = {};
//                    positionObj.name = data.name;
//                    positionObj.coords.latitude = data.point[1];
//                    positionObj.coords.longitude = data.point[0];
//                    var lat = position.coords.latitude;
//                    var lng = position.coords.longitude;
                    var latlon = new mxn.LatLonPoint(data.point[1],data.point[0]);
                    map2.setCenterAndZoom(latlon, 10);

                    var currentLocMarker = new mxn.Marker(latlon);
                    currentLocMarker.setInfoBubble(data.name);

                    map2.addMarker(currentLocMarker);
                    currentLocMarker.openBubble();
                }
            });
        }
    }
    return{
        init:function(){
            return initialize();
        },
        initMap:function(callback){
            initMap(callback);
        },
        findAddress:function(address){
            return findAddress(address);
        },
        renderPoint:function(id){
            return renderPoint(id);
        },
        isInit:function(){
            return bIsInit;
        },
        loadGeostaticList:function(){
            loadGeostaticList();
        }
    };

}());
