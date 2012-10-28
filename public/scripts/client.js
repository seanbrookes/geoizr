
$(document).ready(function(){
    _.templateSettings.variable = "G";

    initialize();

});
/**
 * Initialize
 *
 */
function initialize() {
    navigator.geolocation.getCurrentPosition(renderMap);
    loadGeostaticList();
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
 * Find Address button click handler
 */
$('.btn-address-find').click(function(event){
    var addressValue = $('.input-address').val();
    console.log(addressValue);
    findAddress(addressValue);

});



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

    var template = _.template(
        $( "script.template" ).html()
    );
    $.ajax({
        type: 'GET',
        url: '/geostatics',
        success: function(response){
            var outputString;
            $.each(response, function(item) {
                outputString += '<li data-id="' + this._id + '" class="geostatic-container">';
                if (this.name){
                    outputString += '<p class="geostatic-item-display-name"><a data-id="' + this._id + '" class="cmd-point-name" href="#">' + this.name + '</a></p>'

                }
                outputString += '<a data-id="' + this._id + '" class="cmd-point-name" href="#">' + this.point[0] + ' | ' + this.point[1] + '</a></li>'
            });
            var stringifiedOutput = JSON.stringify(response);
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

                                    console.log('successful delete geostatic:  ' + JSON.stringify(data));
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

                                console.log('successful get geostatic:  ' + data);
                                var test = data;
                                var xyz = test;
                                $(el).after(
                                    template( data )
                                );
                                $('.btn-cancel').click(function(event){
                                    $('.point-form').hide();
                                    event.preventDefault();
                                });
                                $('.btn-save').click(function(event){
                                    var dataObj = {};
                                    test.name = $('.point-form #name').val();
                                    test.description = $('.point-form #description').val();
                                    /**
                                     *
                                     * Update the Geostatic
                                     *
                                     */
                                    $.ajax({
                                        type: 'PUT',
                                        url: '/geostatics/' + $(el).attr('data-id'),
                                        data:test,
                                        dataType: 'application/x-www-form-urlencoded',
                                        success: function(data){
                                            var outputstring;

                                            console.log('successful put geostatic:  ' + JSON.stringify(data));
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
                            error: function(){console.log('fail get')}
                        });




                    }
                }
            );
        },
        error: function(){console.log('fail get')}
    });
}

/**

 PLACE MARKER ON THE MAP


 */
function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    console.log('Place new location: ' + location);

    var x = location.lat();
    var y = location.lng();
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
        success: function(){console.log('successful post')},
        error: function(){console.log('err post')},
        dataType: 'application/json'
    });

}

/**
 * Render Map
 *
 * @param position
 */
function renderMap(position) {
    var mapOptions = {
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'Click to zoom'
    });
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        map.setCenter(event.latLng);
        new google.maps.InfoWindow({
            position: event.latLng,
            content: event.latLng.toString()
        }).open(map);

    });


}