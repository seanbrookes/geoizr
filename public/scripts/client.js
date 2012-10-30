/**
 * added another test comment
 */
$(document).ready(function(){
    _.templateSettings.variable = "G";
    /**
     * Find Address button click handler
     */
    $('.btn-address-find').click(function(event){
        var addressValue = $('.input-address').val();
        console.log(addressValue);
        map.findAddress(addressValue);

    });
    map.initialize();

});
