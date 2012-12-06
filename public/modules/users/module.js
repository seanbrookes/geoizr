/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 07/11/12
 * Time: 11:33 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 * To change this template use File | Settings | File Templates.
 */
var userModule = (function(exports){
    _.templateSettings.variable = "G";

    function init(){

    }
    function displayCurrentUser(){
        $.ajax({
            type:'GET',
            url:'/currentuser',
            success:function(response){
                var resObj = JSON.parse(response);
                $('.lbl-currentuser').text(resObj.currentUser);
                console.log('success:  ' + response);
            },
            error:function(response){
                console.log('error: ' + response);
            }
        });
    }
    return{
        EventBus:function(){
            return $(eventBus);
        },
        init:function(){
            return init();
        },
        displayCurrentUser:function(){
            displayCurrentUser();
        }
    };
}(window));