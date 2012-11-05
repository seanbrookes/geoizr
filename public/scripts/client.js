    /**
     * added another test comment
     */
    // Router
    var AppRouter = Backbone.Router.extend({

        routes:{
            "":"index",
            "map":"map",
            "point/:id":"point"
        },

        index:function () {
            console.log('index');
            homeModule.init();
        },

        map:function () {
            console.log('map');
            if (mapModule.isInit()){
                mapModule.init();
                mapModule.loadGeostaticList();
            }
            else{
                mapModule.initMap(function(){
                    mapModule.init();
                    mapModule.loadGeostaticList();
                });
            }
        },

        point:function (id) {
            if (id){
                console.log('render point: ' + id);

                if (mapModule.isInit()){
                    mapModule.renderPoint(id);
                    mapModule.loadGeostaticList();
                }
                else{
                    mapModule.initMap(function(){
                        mapModule.renderPoint(id);
                        mapModule.loadGeostaticList();
                    });
                }






















            }
            else{
                console.log('Point render was requested but no id was supplied');
            }
        }
    });

    var router = new AppRouter();
    Backbone.history.start();

    $(document).ready(function(){
        _.templateSettings.variable = "G";

        /**
         * Find Address button click handler
         */
        $('.btn-address-find').click(function(event){
            var addressValue = $('.input-address').val();
            console.log(addressValue);
            mapModule.findAddress(addressValue);

        });
        //

    });
