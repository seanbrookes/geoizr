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
        mapModule.findAddress(addressValue);

    });
    mapModule.initialize();

});
    // 22300 River Road Maple Ridge BC
// 22934 Vista Ridge Dr. Maple Ridge BC