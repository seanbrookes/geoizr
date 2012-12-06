/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 * To change this template use File | Settings | File Templates.
 */
var adminModule = (function(exports){
    _.templateSettings.variable = "G";

    function init(){
        $('.main-content-wrapper').load('modules/admin/template.html',function(callback){
            console.log('Admin module loaded ');

			// load all users
			var listTemplate = _.template(
				$( "#UserList").html()
			);
			//var templateOut = $("#tTemplate").html();
			var data = {};
			$('.module-content-container').append(listTemplate( data ));

			$.ajax({
				type:'GET',
				url:'/users',
				success:function(response){
					console.log('Get current users list: ' + response);
					var listItemTemplate = _.template(
						$( "#UserListItem").html()
					);
					//var templateOut = $("#tTemplate").html();
					var data = {};
					var userArray = response;
					$.each(userArray,function(index){
						$('.auth-role-list').append(listItemTemplate( userArray[index] ));
					});
					/**
					 *
					 * User authentication list
					 *
					 */
					$('.auth-role-list').delegate('a','click',function(event){
						console.log('click item: ' + $(this).data('username'));
						var authDataObj = Object.create({});
						authDataObj.username = $(this).data('username');
						authDataObj.password = 'password';

						$.ajax({
							type:'POST',
							url:'/auth',
							data:authDataObj,
							success:function(response){
								var responseObj = JSON.parse(response);
								console.log('auth post success: ' + responseObj.currentUser.userName);
								displayCurrentUser();
							},
							eror:function(error){
								console.log('error authorizing');
							}
						});
						event.preventDefault();
					});
					//$('')
				},
				error:function(response){
					console.log('error: ' + resposne);
				}
			});

            $('.cmd-getcurrentuser').click(function(event){
                event.preventDefault();
                displayCurrentUser();
            });
            displayCurrentUser();
        });
    }
    function displayCurrentUser(){
        $.ajax({
            type:'GET',
            url:'/currentuser',
            success:function(response){
                var resObj = JSON.parse(response);
				if (resObj.currentUser){
					$('.lbl-currentuser').text(resObj.currentUser.userName);
					console.log('current user is logged in:  ' + response);

				}
				else{
					console.log('the current user is not logged in');
				}
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
        }
    };
}(window));






//            $('.create-account-list').delegate('a','click',function(event){
//                console.log('click item: ' + $(this).data('username'));
//
//                $.ajax({
//                    type:'POST',
//                    url:'/users',
//                    data:{
//                        userName:$(this).data('username')
//                    },
//                    success:function(response){
//                        var responseObj = response;
//                        console.log('create post success: ' + responseObj.userName);
//                        displayCurrentUser();
//                    },
//                    eror:function(error){
//                        console.log('error creating account');
//                    }
//                });
//                event.preventDefault();
//            });
