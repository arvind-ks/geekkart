var ccubeApp = angular.module('ccubeApp', ['ccubeAppfilter','ngRoute', 'ngAnimate','toaster','LocalStorageModule','angular-growl','config','ngDialog','ngTable','ngToggle','simplePagination','angular.filter','ngTagsInput','ui.bootstrap','cgPrompt','nvd3','ngActivityIndicator','ckeditor','xdLocalStorage','angularFileUpload','ngSanitize','ngAutocomplete','socialLinks','viewfilesdir','internationalizationModule']);
var sideBarOffsetTop = 0;

ccubeApp.config(['$locationProvider', function($locationProvider) {
	  $locationProvider.hashPrefix('');
}]);

angular.module('ccubeAppfilter', []).filter('ordinal', function() {
	  return function(input) {
	    var s=["th","st","nd","rd"],
	    v=input%100;
	    return input+(s[(v-20)%10]||s[v]||s[0]);
	  }
	}); 

var localStrorageValue = 0;
function isLocalStorageNameSupported(localStorage) {
		
	try { // Try and catch quota exceeded errors
		localStorage.setItem('test','test stored');
		localStorage.getItem('test');
		localStorage.removeItem('test');

	} catch (error) {
			
		localStrorageValue = 1;
		alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
		
	}

}



var windowurl ="";
var folderpath = "";
var RESUMEUPLAODPATH = "";
var WIDGET_PATH = "";
var isLocal = false;
var COMPANYURL = "";
var COMPANYPOLICYDOCUMENTPATH = "";
var hostName = "";

	


ccubeApp.directive('bindHtmlCompile', ['$compile', function ($compile) {
	  return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	      scope.$watch(function () {
	        return scope.$eval(attrs.bindHtmlCompile);
	      }, function (value) {
	        // Incase value is a TrustedValueHolderType, sometimes it
	        // needs to be explicitly called into a string in order to
	        // get the HTML string.
	        element.html(value && value.toString());
	        // If scope is provided use it, otherwise use parent scope
	        var compileScope = scope;
	        if (attrs.bindHtmlScope) {
	          compileScope = scope.$eval(attrs.bindHtmlScope);
	        }
	        $compile(element.contents())(compileScope);
	      });
	    }
	  };
	}]);

ccubeApp.run(function($rootScope,$location,localStorageService,$document,$window,localStorageService,xdLocalStorage,$routeParams,ngDialog,growl,services) {
	
	var localStorage = $window.localStorage;
    isLocalStorageNameSupported(localStorage);
    
	hostName = $location.host();
	windowurl = $location.absUrl();
	
	if($location.host() == "localhost"){
		 
		 folderpath = $location.absUrl().substring(0, $location.absUrl().indexOf("public"));
		 isLocal = true;

		 
	 }else{
		 
		 folderpath = $location.host();
		 isLocal = false;
		 
	 }
	
	RESUMEUPLAODPATH = folderpath +"/resumes";
	COMPANYPOLICYDOCUMENTPATH = folderpath +"/uploads/companyPolicy/";
	COMPANYURL = folderpath;
	var refeLogin = $location.absUrl().substring(0, $location.absUrl().indexOf("referral"));
	
	
    
	
	var iframeUrl = "";
	iframeUrl = '../common-files-v1.0/common-htmls/crossd_iframe.html';
	
	xdLocalStorage.init(
		     {
		        /* required */
		    	 iframeUrl:iframeUrl
		    }).then(function () {
		        //an option function to be called once the iframe was loaded and ready for action
		        //console.log('Got iframe ready');
		    });
	
	  
	var d = new Date();
	  var n = d.getTime();  // n in ms

	    $rootScope.idleEndTime = n+(30*60*144000); // set end time to 10 min
													// from now
	    $document.find('body').on('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart', checkAndResetIdle); // monitor

	    function checkAndResetIdle() // user did something
	    {
	    	
	    	var stringVariable = windowurl;
	        var valueUrlLast = stringVariable.substring(stringVariable.lastIndexOf('/')+1);
	        //console.log('the last param ....'+valueUrlLast);
	    	if(valueUrlLast != 'login' && valueUrlLast.length) {
	    	  
	    		//console.log('inside the check....');
	    		// n in ms
		      	
	    		  //console.log('inside the check....');
			      var d = new Date();
			      var n = d.getTime();  // n in ms
			      	  
			       var autoLogOut = false;
		      
		      var autoLogOut = false;
		       //console.log("======="+n+"=========");
		      
		        if (n>$rootScope.idleEndTime)
		        {
		        	var localStorage = $window.localStorage;
		        	$rootScope.referralsessionId=localStorage.getItem('referralsessionId');
		        	$rootScope.referralloginUserId=localStorage.getItem('referralloginUserId');
		        	var Email = localStorage.getItem('referraluserName');
		            var companyEmployee = {
		        	    	"sessionId" : "",
		        	    	"email" : Email
		        	    }
		        	/*services.updatecompanyUserData(companyEmployee).then(
		        			function(response) {
		        				
		        				// do nothing;

		        			});*/
		        	if($rootScope.referralsessionId!=null && $rootScope.referralsessionId!="null" && $rootScope.referralsessionId!=undefined){
						services.updateEmployeeReferralSessionData(companyEmployee,$rootScope.referralsessionId,$rootScope.referralloginUserId).then(function(data){
							
							if(data.data.code == 200){
								localStorage.clear();
							}
							var loginURL = windowurl.substring(0, windowurl.indexOf("referral"));
							$window.location.href = loginURL+"referral/login/#/";
						},function error(response) {
							localStorage.clear();
							var loginURL = windowurl.substring(0, windowurl.indexOf("referral"));
							$window.location.href = loginURL+"referral/";
						});
					}
		        	autoLogOut = true;  
		        	$rootScope.idleEndTime = n+(30*60*144000); // reset end time
		        	
		        	// close all active popUps
		        	//ngDialog.closeAll();
		        }
		        else
		        {
		            $rootScope.idleEndTime = n+(30*60*144000); // reset end time
		            autoLogOut = false;  
		        }
		        
		        
		        
		        var referralsessionId = "";
		        setTimeout(function (){
		        xdLocalStorage.getItem("referralsessionId").then(function (response) {
		        	referralsessionId = response.value;
		        	//alert(referralsessionId);
		        	//console.log("The referralsessionId is "+referralsessionId);
		        	if(referralsessionId == 'null' || referralsessionId == 'empty' || autoLogOut){
		        		//$document.find('body').off('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart'); // un-monitor
						// events
	
						// localStorage.removeItem('referraluserName');
		        		var localStorage = $window.localStorage;
						localStorage.removeItem('referralwelUserName');
						localStorage.removeItem('referralloginUserId');
						localStorage.removeItem('referralsessionId');
						localStorage.removeItem('jobApplicationId');
						localStorage.removeItem('appJobTitle');
						localStorage.removeItem('points');
//						localStorage.removeItem('companyLogo');
						
						$rootScope.userName = null;
						$rootScope.selectedJobId = null;
						$rootScope.jobId = null
						
						 var absUrl = windowurl;
		
						xdLocalStorage.setItem("referralsessionId", null, function (data) { /* callback */ });
						
						//Any new screeens outside login should be added here
						 if(absUrl.indexOf("retriveYourPassword") < -1){
						$rootScope.sessionTimeOut = true;
						//Add 
						 }
						if($routeParams.operation){
							$rootScope.pageTitle = $location.url().substring(1);
							
						}
						
						 if(absUrl.indexOf("retriveYourPassword") < -1){
						
							 document.location.href = './#/';
						 }
						 
						 if(autoLogOut){
							 growl.error(ClientEmpRefLoginSessionExpiredMessage,{ttl:5000}); //new message 
							 //growl.error('Sorry. Your Login session expired. Please login again'); old message	
							 document.location.href = './#/';
						 }
						 
						 
						 
						 
						 
					
			   		}
		        });
		        }, 1000); 
	        
	    	}
	        
	       
	    }
	  
	  $rootScope.$on('$routeChangeSuccess', function (event, current, previous,$routeParams,ngDialog,services,$location) {
		  
		 if(current.$$route){
			  $rootScope.title = current.$$route.title;
			 }
		 
		
		 
		 if($location){
			 var absUrl = $location.absUrl();
		 }
		 
		
	        var userName = localStorage.getItem('referraluserName');

	        if(userName === null){
	        	
		        setTimeout(function (){

			        xdLocalStorage.getItem("referralsessionId").then(function (response) {
			        	
						referralsessionId = response.value;

				    });

		        }, 1000); //end of setTimeout

	        }
	        
	    });

	});

ccubeApp.factory("services", ['$http','$location','COMPANYID', function($http,$location,COMPANYID) {
	    var obj = {};
	   
	    obj.getCompanySSO = function () {

	    	var companyUrl = windowurl.replace("http://","").replace("https://","");

	    	var fd = new FormData();	

	    	fd.append("companyId", window.btoa(companyUrl));	

	    	return $http.post(DOMAIN_NAME+'/manageAPI/getCompanySSO', fd, {	
	    	transformRequest : angular.identity,	
	    	headers : {	
	    	'Content-Type' : undefined	
	    	}	
	    	});	


	    	};
			
	    	  obj.getERConfig = function(){

	  	    	var fd = new FormData();			
	  			fd.append("sessionId",localStorage.getItem('referralsessionId'));
	  			
	  			return	$http.post(DOMAIN_NAME+'/manageAPI/getERConfig', fd, {
	  				transformRequest : angular.identity,
	  				headers : {
	  					'Content-Type' : undefined
	  				}
	  			});
	  	    	};
	  	    	
	  	    	obj.getReferralFeeds = function(){
					
	  				 var fd = new FormData();
	  				 fd.append('sessionId',localStorage.getItem('referralsessionId'));
	  				
	  				 return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getReferralHomepageDetails', fd, {
	  					transformRequest : angular.identity,
	  					headers : {
	  						'Content-Type' : undefined
	  					}
	  				 });	
	  			}; 

	  			obj.getReferralTestimonialsFeeds = function(entityType){
					
	  				 var fd = new FormData();
	  				 fd.append('sessionId',localStorage.getItem('referralsessionId'));
	  				 fd.append('entityType',entityType);
	  				 return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getReferralTestimonialsFeeds', fd, {
	  					transformRequest : angular.identity,
	  					headers : {
	  						'Content-Type' : undefined
	  					}
	  				 });	
	  			}; 
	  	
	    obj.getReferralDashboardDetails = function(referralloginUserId,userName){
			
			 var fd = new FormData();
			 fd.append('sessionId',localStorage.getItem('referralsessionId'));
			 fd.append('employeeId',referralloginUserId);
			 fd.append('referrerEmailId',userName);
			 return $http.post(DOMAIN_NAME+'/manageESQueries/getReferralDashboardDetails', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			 });	
		};
		
		obj.getIjpDashboardDetails = function(referralloginUserId,userName){
			
			 var fd = new FormData();
			 fd.append('sessionId',localStorage.getItem('referralsessionId'));
			 fd.append('employeeId',referralloginUserId);
			 fd.append('referrerEmailId',userName);
			 return $http.post(DOMAIN_NAME+'/manageESQueries/getIjpDashboardDetails', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			 });	
		};
	    
	    obj.veriyCompanyForHomePageEnable = function(){
	    	
	    	var fd = new FormData();
	    	fd.append('sessionId',localStorage.getItem('referralsessionId'));
			
			return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/veriyCompanyForHomePageEnable/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
	    };
	    
	      obj.getLeaderBoardDetails = function(employeeId, userName){
	    	
	    	var fd = new FormData();
	    	fd.append('sessionId',localStorage.getItem('referralsessionId'));
			fd.append("employeeId", employeeId);
			fd.append("employeeEmailId", userName);
			
			return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getLeaderBoardDetails/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
	    };
	    
	    obj.getLeaderBoardList= function(){
	    	
	    	var fd = new FormData();
	    	fd.append('sessionId',localStorage.getItem('referralsessionId'));
			return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getLeaderBoardList/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
	    };
	    
	    obj.getEmployeeReferralHistory = function(){
	    	
	    	var fd = new FormData();
	    	fd.append('sessionId',localStorage.getItem('referralsessionId'));
			return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getEmployeeReferralHistory/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
	    };
	    
		obj.getAllPointsDetailsForEmployee = function(referralloginUserId, referralloginUserName){
			var fd = new FormData();	
			fd.append("sessionId", localStorage.getItem('referralsessionId'));
			return $http.post(DOMAIN_NAME+'/ErRedemptionAPI/getAllPointsDetailsForEmployee', fd, {
				transformRequest : angular.identity,		
				headers : {		
					'Content-Type' : undefined		
				}		
			});
		};
		 obj.getRedeemptionDetails = function(userid, pageno){
			 
			var fd = new FormData();	
			fd.append("sessionId", localStorage.getItem('referralsessionId'));
			
			 if(pageno=='init')
				 fd.append("pageNo", 0);
			else
				 fd.append("pageNo", pageno);
			
			
			return $http.post(DOMAIN_NAME+'/ErRedemptionAPI/getRedeemptionDetails', fd, {
				transformRequest : angular.identity,		
				headers : {		
					'Content-Type' : undefined		
				}		
			});
			 
		};
	
		 obj.getxoxoxssourl = function(){
			 	var fd = new FormData();	
			fd.append("sessionId", localStorage.getItem('referralsessionId'));
			 
			return $http.post(DOMAIN_NAME+'/ErRedemptionAPI/getXOXOSsoUrl', fd, {
				transformRequest : angular.identity,		
				headers : {		
					'Content-Type' : undefined		
				}		
			});
			 
		};
		
		  obj.getRedeemptioncount = function(){
			  var fd = new FormData();	
			fd.append("sessionId", localStorage.getItem('referralsessionId'));
			return $http.post(DOMAIN_NAME+'/ErRedemptionAPI/getRedeemptioncount', fd, {
				transformRequest : angular.identity,		
				headers : {		
					'Content-Type' : undefined		
				}		
			});
			  
				
			};
			
      /*  obj.isIjenabledService = function(referralsessionId){
			
			return $http.get(DOMAIN_NAME+'/EmployeeReferralAPI/checkLoginSession/'+referralsessionId);
		};
		isIjenabledService*/
		/*obj.getSearchJobList = function(searchJobName, searchlocation) {

			if (typeof searchJobName != "undefined" && searchJobName != "") {

			searchJobName = JSON.stringify(searchJobName);

			searchJobName = searchJobName.replace(/[^a-zA-Z ]/g," ");

			}


			if (typeof searchlocation != "undefined" && searchlocation != "") {

			searchlocation = JSON.stringify(searchlocation);

			searchlocation = searchlocation.replace(/[^a-zA-Z ]/g," ");

			}

			var name = searchJobName;
			var loc = searchlocation;
			var userGeoLocation = "undefined";

			if (name == "") {
			name = "empty";
			}
			if (loc == "") {
			loc = "empty";
			}

			return $http.get(DOMAIN_NAME+'/ccubeAPI/searchJobEmployeeOrVendor/'
			+ COMPANYID + '/' + name + '/' + loc+'/'+userGeoLocation+'/employee/'+COMPANYID);

			};
			
			*/
	
	  	obj.login = function(emailId,password){
	  		
	  		var companyUrl = windowurl.replace("http://","").replace("https://","");
			var fd = new FormData();
			//fd.append("id",COMPANYID);
		 	  	   fd.append("companyUrl", companyUrl);
				   fd.append("emailId", emailId);
				   fd.append("password", password);
				   //fd.append("roleId", 2);
				   
				   
					return $http.post(DOMAIN_NAME+'/identity/v1/loginAccess', fd, {
						transformRequest : angular.identity,
						headers : {
							'Content-Type' : undefined
						}
					});
			
			//return $http.get(DOMAIN_NAME+'/EmployeeReferralAPI/login/'+COMPANYID+'/'+emailId+'/'+password);
		};
		
		obj.loggedInUser = function(sessionId){
			
			 var fd = new FormData();
			 fd.append('sessionId',sessionId);
			 return $http.post(DOMAIN_NAME+'/identity/v1/getLoggedInEmployeeUser/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			 });	
		};
		
		
		
		obj.getJobListCompanyEmployee = function(){
			return $http.get(DOMAIN_NAME+'/EmployeeReferralAPI/getJobListCompanyEmployee/'+COMPANYID);
			
	     };
	     obj.getJobCompanyUser = function (jobId) {
			
			var fd = new FormData();
			fd.append('sessionId',localStorage.getItem('referralsessionId'));
            fd.append("jobId", jobId);
            return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getJobCompanyUser', fd, {
            	transformRequest : angular.identity,
            	headers : { 
            		'Content-Type' : undefined
            		}
            });
         };
			
        obj.getactiveRewardProviderlist = function(){
			 
			var sessionId=localStorage.getItem('referralsessionId');
				if(!sessionId) {
					sessionId=window.location.href.split('sessionId=')[1]
					}
			
			 var fd = new FormData();                                                
             fd.append("companyId", COMPANYID);
			 fd.append('sessionId',sessionId);
                return $http.post(DOMAIN_NAME+'/ErRedemptionAPI/getactiveRewardProviderlist', fd, {
                	transformRequest : angular.identity,
                	headers : { 
                		'Content-Type' : undefined
                		}
                });
			 
 			
 		 };
 		obj.getCompanyExtralnalConfig = function(){
			 
			
			 
			 var fd = new FormData();                                                
			 fd.append('sessionId',localStorage.getItem('referralsessionId'));
                return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getCompanyExternalConfig', fd, {
                	transformRequest : angular.identity,
                	headers : { 
                		'Content-Type' : undefined
                		}
                });
           };
           
		 obj.getCompanyLogo = function(){
			 
			var domainName="";
			var hostName = "";
				
			 if($location.host() == "localhost"){
				 
				 domainName = $location.absUrl().substring(0, $location.absUrl().indexOf("manage"));
				 hostName = domainName;
				 domainName = domainName.replace("http://","").replace("https://","");
				 
				 domainName = domainName +"/manage";
				 
			 }else{
					 
				 hostName = $location.host();
				 domainName = $location.host() +"/manage";
				 domainName = domainName.replace("http://","").replace("https://","");
				 
			 }
			 
			 domainName = window.btoa(domainName);
			 
			 var fd = new FormData();                                                
                fd.append("companyId", COMPANYID);
                fd.append("companyUrl", domainName);
                return $http.post(DOMAIN_NAME+'/manageAPI/getCompanyLogoDeatails', fd, {
                	transformRequest : angular.identity,
                	headers : { 
                		'Content-Type' : undefined
                		}
                });
           };
           
           obj.getConfiguration = function(sessionId,loginUserId){
           
           var domainName="";
			var hostName = "";
				
			 if($location.host() == "localhost"){
				 
				 domainName = $location.absUrl().substring(0, $location.absUrl().indexOf("referral"));
				 hostName = domainName;
				 domainName = domainName.replace("http://","").replace("https://","");
				 
				 domainName = domainName +"/referral";
				 
			 }else{
					 
				 hostName = $location.host();
				 domainName = $location.host() +"/referral";
				 domainName = domainName.replace("http://","").replace("https://","");
				 
			 }
			 
			 domainName = window.btoa(domainName);
			 
  			 var fd = new FormData();                                                
                  fd.append("companyId", COMPANYID);
                  fd.append("companyUrl", domainName);
                  return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getConfiguration/', fd, {
                  	transformRequest : angular.identity,
                  	headers : { 
                  		'Content-Type' : undefined
                  		}
                  });
             };
             
             
             obj.getCompanyNewsFeed = function(sessionId,entityType){
	  				var fd = new FormData();
					fd.append('sessionId', sessionId);
					fd.append('entityType', entityType);
					return $http.post(DOMAIN_NAME+'/configurationsAPI/getCompanyNewsFeed',fd,{
						transformRequest : angular.identity,
						headers : {
							'Content-Type' : undefined
						}
					});
	  				
	  			};
             
            obj.getReferralMapping = function(){
      			 var fd = new FormData();                                                
                      fd.append("sessionId", localStorage.getItem('referralsessionId'));
                      return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getReferralMapping/', fd, {
                      	transformRequest : angular.identity,
                      	headers : { 
                      		'Content-Type' : undefined
                      		}
                      });
              };
			obj.getPointHistory = function (EmployeeId) {
				return $http.get(DOMAIN_NAME+'/EmployeeReferralAPI/getPointHistory/'+EmployeeId);	
			};
			obj.saveNewPassword = function(newPassword, confirmPassword, token) {
				
				var fd = new FormData();
				 fd.append("newPassword", newPassword);
				 fd.append("confirmPassword", confirmPassword);
				 fd.append("token", token);
				 return $http.post(DOMAIN_NAME+'/identity/v1/saveUserPasswordWithToken', fd, {
					transformRequest : angular.identity,
					headers : {
						'Content-Type' : undefined
					}
				});

			};
					
		obj.retriveYourPassword = function(emailId, siteUrl) {
			
			var url = siteUrl;
			
			var fd = new FormData();
			
			fd.append("emailId", emailId);
			
			fd.append("siteUrl", url);
			
			fd.append("companyId", COMPANYID);
			
			return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/retriveYourPassword/', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});

		};
		
		obj.addEmployeeReferralData = function (growl,companyEmployee,sessionId,loginUserId) {

			return $http({
						method: 'POST',
		            url: DOMAIN_NAME + '/EmployeeReferralAPI/addEmployeeReferralData/'+COMPANYID+'/'+"sdfsdfsdf"+'/'+3,
		            data: companyEmployee,
		            headers: {
		                "Content-Type": "application/json",
		                "Accept": "text/plain, application/json"
		            }
			
			 })
				
			
		};
		
		obj.sendInviteCandidatesEmail = function (status,inviteEmail, jobId, userName, growl,mailContent ,mailSubject){
			var fd = new FormData();
			fd.append('status', status);
			fd.append('jobId', jobId);
			fd.append('inviteEmail', inviteEmail);
			fd.append("userName", userName);
			fd.append("mailContent", mailContent);
			fd.append("mailSubject", mailSubject);
			fd.append("sessionId", localStorage.getItem('referralsessionId'));
		return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/sendInviteCandidatesEmail', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
		});
			
		};
		
		/*obj.updatecompanyUserData = function (companyEmployee) {
			return $http({
		            method: 'POST',
		            url: '//EmployeeReferralAPI/updateCompanyUserData',
		            data: companyEmployee,
		            headers: {
		                "Content-Type": "application/json",
		                "Accept": "text/plain, application/json"
		            }
				
		        });
		};*/
		
		obj.updateEmployeeReferralSessionData = function (companyEmployee,referralsessionId,referralloginUserId) {
			
			  var fd = new FormData();
			  fd.append('sessionId', referralsessionId);
			  return $http.post(DOMAIN_NAME+'/identity/v1/updateUserSessionData', fd,{
			         transformRequest : angular.identity,
			         headers: {
			                'Content-Type': undefined   
			         }      
			   });
		};
		
        obj.changeEmployeePassword = function (companyEmployee) {
			
			return $http({
		            method: 'POST',
		            url: '/EmployeeReferralAPI/changeEmployeePassword/'+COMPANYID,
		            data: companyEmployee,
		            headers: {
		                "Content-Type": "application/json",
		                "Accept": "text/plain, application/json"
		            }
				
		        });
		};
		
		 obj.changeEmployeePasswordWithSessionId = function (changePassword) {
	        	
			 var fd = new FormData();
			  fd.append('changePassword', JSON.stringify(changePassword));
			  fd.append('sessionId', localStorage.getItem('referralsessionId'));
			  
			  return $http.post(DOMAIN_NAME+'/identity/v1/changepassword', fd,{
			            transformRequest : angular.identity,
			            headers: {
			                'Content-Type': undefined   
			            }
			           
			        });
			};
		

        obj.getEmployeeLoggedInDetails = function (employeeId,employeeEmailId) {
			
	  var fd = new FormData();
	  fd.append('companyId', COMPANYID);
	  fd.append('employeeId', employeeId);
	  fd.append("employeeEmailId", employeeEmailId);
	
	  return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getEmployeeLoggedInDetails', fd, {
		transformRequest : angular.identity,
		headers : {
			'Content-Type' : undefined
		}
        });
	
	};
	
    obj.getReferralSuggestions = function(referralloginUserId){
		
		 var fd = new FormData();
		 fd.append('sessionId',localStorage.getItem('referralsessionId'));
		 fd.append('referralloginUserId',referralloginUserId);
		 return $http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getReferralSuggestions/', fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		 });	
	};
    
    obj.getReferralSuggestionsnew = function(referralloginUserId){
		
		var jobs = [];
    	return jobs;
    };
	
	obj.getMyReferrals = function (employeeId,employeeEmailId,operation) {
		
		  var fd = new FormData();
		  fd.append('companyId', COMPANYID);
		  fd.append('employeeId', employeeId);
		  fd.append("employeeEmailId", employeeEmailId);
		  fd.append("operation", operation);
		
		
		
		return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getMyReferrals', fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
	        });
		
		};
		
		obj.getReferralsPointsForApplicant = function (employeeId,employeeEmailId) {
			
			  var fd = new FormData();
			  fd.append('sessionId',localStorage.getItem('referralsessionId'));
			  fd.append('employeeId', employeeId);
			  fd.append("employeeEmailId", employeeEmailId);
			
			   return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getReferralsPointsForApplicant', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
		        });
			
			};
		
		
		
		obj.getApplyFields = function(sessionId,loginUserId,jobId,portalSource) {
			portalSource = "emplyeeReferralPortal";
			var type = null;
			var fd = new FormData();
			fd.append('companyId', COMPANYID);
			fd.append('sessionId',localStorage.getItem('referralsessionId'));
			fd.append('jobId', jobId);
			fd.append('portalSource', portalSource);
			fd.append("type", type);
		
			return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getApplyFields', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
		     });
		};


		obj.getApplyFieldsConfiguration = function(jobUrl,campusURL, jobId, portalSource, sessionId){
			portalSource = "EMPLOYEE_REFERRAL";
			sessionId = localStorage.getItem('referralsessionId');
			var companyUrl = windowurl.replace("http://","").replace("https://","");
			var formData = new FormData();
			if(jobUrl == undefined){
				jobUrl = "empty";
			}
			formData.append("jobUrl", jobUrl);	
			// formData.append("companyId", COMPANYID);

			if(campusURL == undefined){
				campusURL = "empty";
			}
			formData.append("campusURL", campusURL);
			return $http.get(DOMAIN_NAME+'/data-service/v1/apply_fields/company/'+COMPANYID+'?jobURL='+jobUrl+'&campusURL='+campusURL+'&jobId='+jobId+'&portalSource='+portalSource, {
				transformRequest : angular.identity,		
				headers : {		
					'Content-Type' : undefined,
					'sessionId':sessionId
	
				}
			});
		};
		
		obj.getCustomApplyFields = function(jobId) {
			var fd = new FormData();
			  fd.append('sessionId',localStorage.getItem('referralsessionId'));
			  fd.append('jobId', jobId);
			   return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getCustomApplyFieldsByTemplateId', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
		      });
 		};
 		
		obj.getCompanyPolicy = function(type) {
			
			var fd = new FormData();
			  fd.append('sessionId',localStorage.getItem('referralsessionId'));
			  fd.append('type', type);
			   return	$http.post(DOMAIN_NAME+'/EmployeeReferralAPI/getCompanyDocuments', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
		      });
			
		};
				
		// resume parser
		obj.resumeParser = function(file,fileName)
		{
			var fd = new FormData();
			if (file != "null") {
				var oBlob = new Blob([ 'test' ], {
					type : "text/plain"
				});
				fd.append("file", file);
			}
			fd.append("fileName", fileName);
			 fd.append('sessionId',localStorage.getItem('referralsessionId'));
			return $http.post(DOMAIN_NAME+'/ApplyJobAPI/resumeParser', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
		}
		
		//submit Resume
		obj.submitResume = function(jobApplication,filename)
		{
			var fi = document.getElementById('fileUploadReferral');
		    var file =fileUploadReferral.files[0];
			var fileName = filename;
			var fd = new FormData();
			var companyUrl = windowurl.replace("http://","").replace("https://","")
			fd.append('companyUrl', companyUrl);
			
			fd.append('data', angular.toJson(jobApplication));

			if (file != "null") {
				var oBlob = new Blob([ 'test' ], {
					type : "text/plain"
				});
				fd.append("file", file, fileName);
			}
				
		
			return $http.post(DOMAIN_NAME+'/ApplyJobAPI/parseAndRecommendJobs', fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			});
		}
								
	return obj;   
	}]);


ccubeApp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; // parse to int
        if(input != null){
        	return input.slice(start);
        } else {
        	return "";
        }
    };
   
  
   
});

ccubeApp.controller('loCtrl', function ($scope, $rootScope, $location, $routeParams, services,localStorageService,growl,xdLocalStorage,$timeout) {
	$scope.$on('$viewContentLoaded', function() {
		
		var hostName = $location.host();
		var siteUrl = "";
		
		$rootScope.fullJobList = undefined;
		$scope.enableIjp=localStorage.getItem('enableIjp');
		$scope.HomeEnabled = localStorage.getItem('eRHomePage');
		services.getCompanyLogo().then(function(data) {
			$scope.configurationExternalSystem = data.data;
			
			if($scope.configurationExternalSystem.companyLogoName == "" || $scope.configurationExternalSystem.companyLogoName == null || $scope.configurationExternalSystem.companyLogoName == 'null'){
			
				$scope.companyName = $scope.configurationExternalSystem.companyName;
				
			}else{
			 
			if($scope.configurationExternalSystem.companyFolderPath == ""){
			
		        	
		        	$scope.imageSrcCompanyLogos = "../images/"+$scope.configurationExternalSystem.companyLogoName;
		        
		        } else {
		        	
		        	if(isLocal) {
		        		
		        		siteUrl = COMPANYURL;
		        		
		        		$scope.imageSrcCompanyLogos = "../images/"+$scope.configurationExternalSystem.companyLogoName;
		        	} else {
		        		
		        		$scope.imageSrcCompanyLogos = "../images/"+$scope.configurationExternalSystem.companyLogoName;
		        	}
		        	

		        }
			}
			
			
			 localStorage.setItem('companyLogo', $scope.imageSrcCompanyLogos);	
			 localStorage.setItem('careerSiteLogo', $scope.configurationExternalSystem.companyLogoName);	
			 $scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
			 //localStorage.setItem('companyName', $scope.companyName);
			
			 localStorage.setItem('companyName', $scope.companyName);
			 $rootScope.companyNameDisplay =  $scope.companyName;
		});
		
		
		 var emailId =  localStorage.getItem('referraluserName');
		
		 if($rootScope.sessionTimeOut){
			 growl.error(ClientEmpRefSessionExpiredMessage,{ttl:5000}); //new message
			//growl.error('Sorry. Your session expired. Please login again'); old message
			
	         services.loggedInUser(emailId).then(function(data){
		     $scope.user = data.data;
		     $scope.user.password = null;
		
	         },function error(response) {
				$location.path('/logout');
			});
	         $rootScope.sessionTimeOut = false;
		}
		 
    });
	
	$timeout( function(){ $scope.callAtTimeout(); }, 1000);
	
	$scope.callAtTimeout = function() {
		var referralsessionId = "";
		xdLocalStorage.getItem("referralsessionId").then(function (response) {
			referralsessionId = response.value;	
	    });
    }
	
	  $scope.addEmployeeData = function() {
	    	
          $scope.companyEmployee.pointBalance = 0;
          $scope.companyEmployee.isActive = 1;
	    	
	    	$scope.sessionId=localStorage.getItem('sessionId');
	        $scope.loginUserId=localStorage.getItem('loginUserId');
	    	
	    	
        services.addEmployeeReferralData(growl,$scope.companyEmployee,"null","null").then(function(response){
	    		
	    		if (response.data.code == 200) {
	    			
	    			 	growl.success(ClientEmpRefRequestSuccessMessage,{ttl:5000}); //new message
	    			 	//growl.success("Request sent successfully"); old message
				         $scope.companyEmployee.email ='';
	 			         $scope.companyEmployee.employeeName ='';
	 			         $location.path('/');
		        
	    		}else if(response.data.code == 501){
	    			
	    			 $scope.employeeNotSaved = "You are not authorized to register";
	    			 
	    		} else if(response.data.code == 502){
	    			
	    			$scope.alreadyregistered = "The email Id has been already registered";
	    			$('#showPassword').show();
	    		}
	    		else if(response.data.code == 504){
	    			
	    			$scope.nodomainname = "You are not authorized to register";
	    		     
	    		}
	    		else{
	    			growl.error(CommonFailureMessage,{ttl:5000}); //new message
	    			//growl.error("Something went wrong");	 old message
	    		}
	    		
	    	 });
	    	
	    	
	    	
	    }
	  
	  $scope.onChangeSetErrNull = function(){
		  $scope.employeeNotSaved='' ;
		  $scope.alreadyregistered='';
		  $scope.nodomainname=''
	      $('#showPassword').hide();
		  $scope.failuremsg='' ;
	  }
	
	$scope.submitLoginForm = function() {
		var storageType = localStorageService.getStorageType();
		services.login($scope.user.emailId,$scope.user.password).then(function(ResponseObject){
			
			$rootScope.sessionTimeOut = false;
			$scope.loginstatus = ResponseObject.data.loginSuccess;
	        $scope.referralsessionId = ResponseObject.data.sessionId;
	        if($scope.loginstatus == 'false' || $scope.loginstatus == false){
	        	$scope.failuremsg = " Sorry! Looks like you typed it wrong. Please try again.";
	        }
	        else if($scope.loginstatus == 2 || $scope.loginstatus == '2')
	        	{
	        	$scope.failuremsg = "Sorry! Looks like you typed it wrong. Please try again.";
	        	}
	        else if($scope.loginstatus == 3 || $scope.loginstatus == '3')
        	{
	        	$scope.failuremsg = "You are not authorized to access this portal.";
        	} else if($scope.loginstatus == 4 || $scope.loginstatus == '4'){
	        	$scope.failuremsg = "5 incorrect attempts to verify login. Please try again in 10 minutes.";
	        } else if($scope.loginstatus == 5 || $scope.loginstatus == '5'){
	        	$scope.failuremsg = "Too many incorrect attempts to verify login. Please try again in 10 minutes.";
	        } else{
				if($scope.referralsessionId!=null && $scope.referralsessionId!="null" && $scope.referralsessionId!=undefined){
					services.loggedInUser($scope.user.emailId,$scope.referralsessionId).then(function(data){
						
						$scope.loggedInUser = data.data;
						xdLocalStorage.setItem('referralsessionId', $scope.loggedInUser.sessionId, function (data) { /* callback */ });
						//alert(JSON.stringify(data.data));
						localStorage.setItem('referralsessionId', $scope.loggedInUser.sessionId);
						localStorage.setItem('referralloginUserId', $scope.loggedInUser.id);
						localStorage.setItem('referraluserName', $scope.loggedInUser.user.emailId);
						
						localStorage.setItem('referralwelUserName', $scope.loggedInUser.user.username);
						localStorage.setItem('points', $scope.loggedInUser.pointBalance);	
						localStorage.setItem('referrallencodedEmailId', $scope.loggedInUser.encodedEmailId);
						$rootScope.userName = $scope.user.email;
						$rootScope.userNameDisplay = $scope.loggedInUser.employeeName;
						localStorage.setItem('referrallisUserExist','yes');
					
						$location.path('/job-list');
						

					},function error(response) {
						$location.path('/logout');
					});
				}
	        	
	        } 
	    });		
	}
	
});


ccubeApp.controller('referralBenefitsCtrl', function ($scope, $rootScope, $location, $routeParams, services,localStorageService,$window,xdLocalStorage) {
	$scope.toggleLaeder = "no";
    $scope.togglemyReferral = "no";
    $scope.togglemyRedeemPoints= "no";
	$scope.toggleCompanyPolicy = "no";
	$scope.togglemyApplies = "no";
	$scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.togglehome = "no";
	$scope.toggleijp = "no";
    $scope.toggleBenefits = "yes";
    
    $scope.getReferralSuggestions = function() {
		
	      services.getReferralSuggestions().then(function(data) {
		
	    	$scope.referralSuggestions = data.data;
	    	
	    	
	    	
	    	$scope.referralSuggestionsLength = $scope.referralSuggestions.length;
	    	
		  });
		}
    
    $scope.init = function() {
		this.getReferralSuggestions();
	};
});

ccubeApp.controller('logOutCtrl', function ($scope, $rootScope, $location, $routeParams, services,localStorageService,$window,xdLocalStorage) {

	var localStorage = $window.localStorage;
	$scope.referralsessionId=localStorage.getItem('referralsessionId');
    $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
	//localStorage.removeItem('managePagePath');
	//localStorage.removeItem('operation');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	sessionStorage.removeItem('referralFilterTags');
	sessionStorage.removeItem('referralFilter');
	
	$rootScope.moduleName=null;
	$rootScope.companyNameDisplay=null;
	if(localStrorageValue == 0) {
		localStorage.setItem('hmPanelSessionActive','no');
	}
	
	xdLocalStorage.setItem("referralsessionId", "empty", function (data) { /* callback */ });
	
	
	var Email = localStorage.getItem('referraluserName');
	/*var companyEmployee = {
	    	"referralsessionId" : "",
	    	"email" : Email
	    }*/
	var companyEmployee = {
	    	"sessionId" : "",
	    	"email" : Email
	    }
		 
		if($scope.referralsessionId != "null" && $scope.referralsessionId != null && $scope.referralsessionId != undefined){

			services.updateEmployeeReferralSessionData(companyEmployee,$scope.referralsessionId,$scope.referralloginUserId).then(function(data){
				$rootScope.userName = null;
				$rootScope.selectedJobId = null;
				$rootScope.jobId = null
				$rootScope.appStatus = null;
				windowurl = $location.absUrl();
				localStorage.clear();
				 var loginURL = windowurl.substring(0, windowurl.indexOf("referral"));
				 $window.location.href = loginURL+"referral/";
				
			},function error(response) {
				localStorage.clear();
				var loginURL = windowurl.substring(0, windowurl.indexOf("referral"));
				$window.location.href = loginURL+"referral/";
			});

		 }else{
		    localStorage.clear();
			var loginURL = windowurl.substring(0, windowurl.indexOf("referral"));
			$window.location.href = loginURL+"referral/";

		 }
	
});

ccubeApp.config(function($compileProvider){
   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|whatsapp):/);
});

ccubeApp.config(function (localStorageServiceProvider) {
	  localStorageServiceProvider
	    .setPrefix('ccube')
	    .setStorageType('sessionStorage')
	    .setNotify(true, true)
	});


ccubeApp.config(function($httpProvider) {
    
    $httpProvider.interceptors.push(function($q) {
        return {
            request: function(config) {
               
                return config;
            },
            response: function(responce) {
            	
            	if(responce.data){
            		
            		
            		if(typeof responce.data.webserviceAPIResponseCode == "undefined"){
            			
            		}else{
            			
            			if(responce.data.webserviceAPIResponseCode == UNAUTHORIZED){
            				$('#logout').click();
            				document.location.href = './#/logout';
            			}
            			console.log("response without :"+JSON.stringify(responce.data.webserviceAPIResponseCode));
            		}
            			
            	}else{
            		//console.log("response :"+responce);
            	}
                
                if(responce.status === 403) {
                    console.log('403')
                }
                return responce || $q.when(responce);
            },
            responseError: function(rejection) {
               //alert(rejection);
                if(rejection.status === 403) {
                    console.log('403', rejection);
                }
                return $q.reject(rejection);
            }
        }
    });
    
  })

ccubeApp.config(['growlProvider', function (growlProvider) {
	  growlProvider.globalTimeToLive(2000);
	  growlProvider.globalReversedOrder(true);
	}]);


ccubeApp.config(['$routeProvider',  '$httpProvider', 
		function($routeProvider, $httpProvider) {
	
	 $httpProvider.defaults.cache = false;
	    if (!$httpProvider.defaults.headers.get) {
	      $httpProvider.defaults.headers.get = {};
	    }
	  
	    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	
				$routeProvider
				
				.when('/', {	
					title: 'Login',
					templateUrl: 'angular-pages/intermediate.html',
					controller: 'intermediateCtrl'
				})
				
				
				.when('/intermediate', {
					title: 'Login',
					templateUrl: 'angular-pages/intermediate.html',
					controller: 'intermediateCtrl'
					  })
					  
				.when('/job-list', {
					title: 'Job List',
					templateUrl: '../common-files-v1.0/common-htmls/job-list-referral-partner.html',
					controller: 'mainController'
                })
                .when('/job-list/:configurationName', {
					title: 'Job List',
					templateUrl: '../common-files-v1.0/common-htmls/job-list-referral-partner.html',
					controller: 'mainController'
                })
                    .when('/home', {
                        title: 'Home',
                        templateUrl: 'angular-pages/home.html',
                        controller: 'homeController'
                    })
                    // .when('/IJP', {
                    //     title: 'IJP',
                    //     templateUrl: '../common-files-v1.0/common-htmls/IJP.html',
                    //     //  controller: 'mainController'
					// })
					
					.when('/ijp', {
						title: 'IJP',
                       templateUrl: '../common-files-v1.0/common-htmls/job-list-referral-partner.html',
						  controller: 'mainController'
						 
                    })
				 .when('/leaderboard', {
					title: 'Leader Board',
					templateUrl: 'angular-pages/leaderboard.html',
					controller: 'leaderBoardController'
			   })
			   .when('/changePassword/:employeeId/:employeeEmailId/:employeeUserName', {	
					title: 'Change Password',
					templateUrl: 'angular-pages/changePassword.html',
					controller: 'cpInterCtrl'
				})
				.when('/changePassword', {	
					title: 'Change Password',
					templateUrl: 'angular-pages/changePassword.html',
					controller: 'cpCtrl'
				})
				.when('/Change-Password', {	
					title: 'Change Password',
					templateUrl: 'angular-pages/change-password.html',
					controller: 'cpCtrl'
				})
			   
			   .when('/my-referral', {
					title: 'My Referral',
					templateUrl: 'angular-pages/my-referral.html',
					controller: 'appliesListEsCtrl'
			   })
			   .when('/redeemPoints', {
					title: 'Redeem Points',
					templateUrl: 'angular-pages/redeemPoints.html',
					controller: 'redeemPointsController'
			   })
			    .when('/companyPolicy', {
					title: 'Company Policy',
					templateUrl: 'angular-pages/companyPolicy.html',
					controller: 'companyPolicyController'
			   })
			   .when('/myApplies', {
					title: 'My Applies',
					templateUrl: 'angular-pages/myApplies.html',
					controller: 'appliesListEsCtrl'
			   })
			   .when('/customMenu1', {
					title: 'Custom Menu',
					templateUrl: 'angular-pages/custom-menu.html',
					controller: 'customMenuCtrl'
			   })
			   .when('/customMenu2', {
					title: 'Custom Menu',
					templateUrl: 'angular-pages/custom-menu.html',
					controller: 'customMenuCtrl'
			   })
			   .when('/customMenu3', {
					title: 'Custom Menu',
					templateUrl: 'angular-pages/custom-menu.html',
					controller: 'customMenuCtrl'
			   })
			    .when('/configure', {
					title: 'Configure',
					templateUrl: 'angular-pages/configure.html',
					controller: 'erConfigController'
			   })
			   
	.when('/retriveYourPassword', {
		
		title : 'Retrive Your Password',
		templateUrl : 'angular-pages/retrivepassword.html',
		controller:'retriveYourPasswordCtrl'
			
	})
	.when('/newPassword/:userId', {
		
		title : 'New Password',
		templateUrl : 'angular-pages/new-password.html',
		controller:'newPasswordCtrl'
			
	})
	.when('/viewjob', {
		
		title : 'View Job',
		templateUrl : 'angular-pages/job-view.html',
		controller:'jobViewCrtl'
			
	})
	.when('/viewjob/:jobId', {
		
		title : 'View Job',
		templateUrl : 'angular-pages/job-view.html',
		controller:'jobViewCrtl'
			
	})
	.when('/viewjob/:jobId/:operation', {
		
		title : 'View Job',
		templateUrl : 'angular-pages/job-view.html',
		controller:'jobViewCrtl'
			
	})
	.when('/request-access', {
		
		title : 'RequestAccess',
		templateUrl : 'angular-pages/request-access.html',
		controller:'loCtrl'
			
	})
	.when('/viewPoints', {
		
		title : 'points History',
		templateUrl : 'angular-pages/pointshistory.html',
		controller:'pointsHistoryCrtl'
			
	}).when('/logout', {
				    title: 'Login',
					templateUrl: 'angular-pages/login.html',
					controller: 'logOutCtrl'
			   }).	
			   when('/referral-benefits', {
				    title: 'Referral Benefits',
					templateUrl: 'angular-pages/referral-benefits.html',
					controller: 'referralBenefitsCtrl'
			   }).	
				otherwise({
						redirectTo: '/'
				});
		
		}
]);

function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Retrive your password
ccubeApp.controller('retriveYourPasswordCtrl', function($scope, services, $location,
		toaster, $location, $window, $rootScope, localStorageService, $activityIndicator) {
	
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	$scope.url = localStorage.getItem('websiteurl');
	var companyId = localStorage.getItem('companyId');
	var siteUrl = $location.absUrl();
	$rootScope.sessionTimeOut=false;
	$scope.retriveYourPassword = function() {
		
		$activityIndicator.startAnimating();
		services.retriveYourPassword($scope.emailId, siteUrl).then(function(response) {
			
			$activityIndicator.stopAnimating();
		
			if (response.data.code === 1) {

				toaster.pop('success', "", response.data.message);
				$location.path('login');
	

			} else {
				toaster.pop('error', "", response.data.message);
			}

		});
	};

});

//Get New password
ccubeApp.controller('newPasswordCtrl', function($scope, services, $location,
		toaster, $location, $window, $rootScope, localStorageService,
		$routeParams,$activityIndicator) {
	
	$scope.referalName = localStorage.getItem('referraluserName');
	services.getCompanyLogo().then(function(data) {
		$scope.configurationExternalSystem = data.data;
		
		
		
		if($scope.configurationExternalSystem.companyLogoName == "" || $scope.configurationExternalSystem.companyLogoName == null || $scope.configurationExternalSystem.companyLogoName == 'null'){
		
			$scope.companyName = $scope.configurationExternalSystem.companyName;
			
		}else{
		 
		if($scope.configurationExternalSystem.companyFolderPath == ""){
		
	        	
	        	$scope.imageSrcCompanyLogos = "images/"+$scope.configurationExternalSystem.companyLogoName;
	        
	        } else {
	        	
	        	if(isLocal) {
	        		
	        		siteUrl = COMPANYURL;
	        		
	        		$scope.imageSrcCompanyLogos = "/images/"+$scope.configurationExternalSystem.companyLogoName;
	        	} else {
	        	
	        		$scope.imageSrcCompanyLogos = "http://"+$scope.configurationExternalSystem.siteUrl+"/images/"+$scope.configurationExternalSystem.companyLogoName;
	        	}
	        	

	        }
		}
		 localStorage.setItem('companyLogo', $scope.imageSrcCompanyLogos);	
		 $scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
		 localStorage.setItem('companyName', $scope.companyName);
		
		
	});
	
	$scope.newpassword = null;
	$scope.confirmpassword = null; 
	var userId = $routeParams.userId;
	var uuid = $routeParams.uuid;
	$scope.url = localStorage.getItem('websiteurl');
	
	//localStorage.setItem('points', $scope.loggedInUser.pointBalance);
	
	$scope.saveNewPassword = function() {
		//$scope.newPasswordForm.newpassword = $scope.newpassword;
		$activityIndicator.startAnimating();
		if(uuid!=null && uuid!="null" && uuid!=undefined){
		services.saveNewPassword($scope.newpassword, $scope.confirmpassword,
			uuid).then(function(data) {
   
			$activityIndicator.stopAnimating();
			
			if(data.status === 200){
			   toaster.pop('success', "", data.data.reponseObject);
			   $location.path('login');
			}
			   
	   },function error(response) {
		   
		   toaster.pop('error', "", response.data.message);
  	 });
	}
	};
	

});

ccubeApp.controller('pointsHistoryCrtl', function($scope,Pagination,localStorageService,$activityIndicator,services,growl,$rootScope) {

	$scope.userName = localStorage.getItem('referraluserName');
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	$scope.userId = localStorage.getItem('referralloginUserId');
	var companyId = localStorage.getItem('companyId');
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
	services.getPointHistory($scope.userId).then(function(data){
		
		$scope.pagination = Pagination.getNew(PAGESIZE);
		var pointshistory = data.data;
		$scope.pointshistory = pointshistory;
		
		$scope.points=$scope.pointshistory[0].totalPoints;
		localStorage.setItem('points', $scope.points);
		
		 $scope.pagination.numPages = Math.ceil($scope.pointshistory.length/$scope.pagination.perPage);
	        $scope.pageSize = PAGESIZE;
	});
	$scope.totalpoints = localStorage.getItem('points');
	 // sorting the data
    $scope.sort = {
            active: '',
            descending: undefined
        }     
         	
        $scope.changeSorting = function(column) {

            var sort = $scope.sort;
 
            if (sort.active == column) {
                sort.descending = !sort.descending;
				
            } else {
                sort.active = column;
                sort.descending = false;
            }
        };
        
       // getting the relevent icon on sorting
        $scope.getIcon = function(column) {
                     
            var sort = $scope.sort;
            
            if (sort.active == column) {
              return sort.descending
                ? 'glyphicon-chevron-up'
                : 'glyphicon-chevron-down';
            }
            
            return 'glyphicon-star';
        }
	
});
ccubeApp.controller('jobViewCrtl', function($scope,localStorageService,$activityIndicator,services,growl,$rootScope,$sce,$location,$routeParams) {
	$scope.userName = localStorage.getItem('referraluserName');
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	$scope.jobId=localStorage.getItem('JobId');
	$scope.points = localStorage.getItem('points');	
	$rootScope.applicationLimit = 5;
	$rootScope.uuid = localStorage.getItem('uuid');
	 $scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	 var userName = localStorage.getItem('referraluserName');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.pageRedirectOperationForER = 'home';
	if($routeParams.operation != undefined){
		$scope.pageRedirectOperationForER=$routeParams.operation;
	}    	
	
	if ($scope.userName === null) {
		sessionStorage.setItem('managePagePath', "job-view");
		if($location.search().source === 'ijp'){
			localStorage.setItem('ijpactive', true);
		}
		localStorage.setItem('JobId', $routeParams.jobId);
	
		$location.path('/');
		return;
	}
	
	if($routeParams.jobId || localStorage.getItem('JobId')){
		
			 if($routeParams.jobId){
				 $scope.jobId = $routeParams.jobId;
				}else{
					$scope.jobId =	localStorage.getItem('JobId');
				}
	}
	
	 $rootScope.jobLimit = 5;
	 if($location.search().source === 'ijp'){
			$scope.toggleijp="yes";
			$scope.togglehome = "no";
	} else {
		$scope.toggleLaeder = "no";
	    $scope.togglemyReferral = "no";
		$scope.togglehome = "yes";
		$scope.toggleijp = "no";
	    $scope.toggleBenefits = "no";
	    $scope.togglemyRedeemPoints= "no";
	    $scope.toggleCompanyPolicy = "no";
	    $scope.togglemyApplies = "no";
	    $scope.toggleCustomMenu1 = "no";
		$scope.toggleCustomMenu2 = "no";
		$scope.toggleCustomMenu3 = "no";
	}
	    var referralloginUserId=localStorage.getItem('referralloginUserId');
		
	    $scope.formRedeem={};
		 $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
		 $scope.referralloginUserName = localStorage.getItem('referraluserName');
		services.getAllPointsDetailsForEmployee($scope.referralloginUserId, $scope.referralloginUserName).then(function(data){
	   	 $scope.formRedeem.pointsAvailed=data.data.pointsAvailed;
	   	 $scope.formRedeem.totalPoints=data.data.totalPoints;
	   	 $scope.formRedeem.pointsPending=data.data.pointsPending;
	   	 $scope.formRedeem.currentPoint=data.data.currentPointBalance;
	   	 $scope.currentPoint=data.data.currentPointBalance;
	   	
	    });
		
	services.getJobCompanyUser($scope.jobId).then(function(data){
		
		var job = data.data;
		$rootScope.job = job;

		$rootScope.ijpactive=false;
		if($location.search().source === 'ijp' || localStorage.getItem('ijpactive') == 'true'){
			$rootScope.ijpactive=true;
		}
		
		id = $rootScope.job.id;
		
		var recruiterList=_.groupBy(job.jobCollabratorList,'role');
		$rootScope.rolesToDisplay=[];
		angular.forEach(recruiterList,function(value,key){
			var emailId='';
			var obj={};
			for(i=0;i< value.length;i++){
				if(value[i].emailId !=undefined && value[i].emailId !=null && value[i].emailId !=''){

					emailId=emailId+(emailId =='' ? '' :', ')+value[i].emailId;
				}
			}
			obj[key]=emailId;
			$rootScope.rolesToDisplay.push(obj);
		});
		if(job.isEmployeeReferralEnabled == "true"){
			$rootScope.isShareJobEnabled=true;
		}else{
			$rootScope.isShareJobEnabled=false;
		}
		
		var now = new Date().getTime();
		var diff=now-job.createdDate;
		var n = (now - job.createdDate)/1000;
		if(n < 3600){
			 var diff = 'Just Now'
		}
		else if(n < 86400){
			 var hours_n = Math.floor(n/3600);
			 var diff= hours_n + ' Hour' + (hours_n > 1 ? 's' : '') + ' Ago';
			
		}
		else if (n < 2629743) { // less than a week
             var day_n = Math.floor(n/86400);
             var diff= day_n + ' Day' + (day_n > 1 ? 's' : '') +' Ago';
           
		 } 

		 else if (n < 31556926) { // less than 12 months
             var month_n = Math.floor(n/2629743);
             var diff= month_n + ' Month' + (month_n > 1 ? 's' : '') +' Ago';
                 
		 } else { 
             var year_n = Math.floor(n/31556926);
             var diff= year_n + ' Year' + (year_n > 1 ? 's' : '') +' Ago';
               
		 }	
		
		$scope.diff=diff;
	});
	
    $scope.setFileName = function(fileInput) {
        var filename = null;    		

 		var validFileExtensions = TEXT_FILE_TYPES;   
           var sFileName =fileInput.value;
           
                 for (var j = 0; j < validFileExtensions.length; j++) {
                     var sCurExtension = validFileExtensions[j];
                     if (typeof fileUpload.files[0] != "undefined" &&  sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                     	$scope.filetype = "valid";
                         break;
                         
                     }else{
                     	$scope.filetype = "invalid";
                     }
                 }
                 
 		$scope.resumeRequiredErr = "no";
 		$scope.fileSizeExceededErr = "";
 		 //limit files size to <=2MB
 		if(typeof fileUpload.files[0] != "undefined" && fileUpload.files[0].size > 2097152){
 			$scope.fileSizeExceededErr = "The file size exceeds the allowed limit"; 
 			$scope.fileSizeValidation = false;
 		}else{$scope.fileSizeValidation = true;}
 		var file = fileInput.value;
 		var filename = file.replace(/^.*[\\\/]/, '');
 		
 		$scope.fileName = '';
 		$scope.$apply();
 		$scope.fileName = filename;
 		$scope.$apply();
 		
	    };
	    
	   
	
/*	 $scope.addProfilePopup = function(job_id, job_title, location , job_experience) {
		 $scope.jobTitle = job_title;
		 localStorage.setItem('JobId', job_id);
			$scope.location = location.split(';').join('/');
			
			$scope.experience = job_experience;
		
			
			$scope.JobApplication = null;
			$scope.JobApplication={};
			$scope.fileName=null;
			 $activityIndicator.startAnimating();
			 to get apply fields 
			 $scope.filetype = "valid"; 
			 $scope.fileSizeExceededErr=false;
			
				services.getApplyFields().then(function(data){
					
					$rootScope.getApplyFields = data.data;	
					
					$activityIndicator.stopAnimating();
					
				});
				
		 };*/
	
	var jobID  = null;
	var isEmployeeReferralEnabled=true;
	//widget share email function
	 $scope.sendEmail = function(job_id,is_Employee_Referral_Enabled) {
		 jobID = job_id;
		 isEmployeeReferralEnabled=is_Employee_Referral_Enabled;
		 localStorage.setItem('managePagePath','job-view');
		 // To get job
		 services.getJobCompanyUser(jobID).then(function(data){
				var job = data.data;
				 var url = $location.absUrl();
				if (isLocal) {
					
					$scope.companyLogo=  COMPANYURL +'manage/images/'+ job.companyLogo ;
				
				}else if(url.indexOf(job.careerSiteurl) > -1){
					
					$scope.companyLogo=  "http://"+job.careerSiteurl + "/manage/images/"+  job.companyLogo ;
					
					
				}else {
					
					$scope.companyLogo = COMPANYURL +'manage/images/'+ job.companyLogo;
				}
				
				
			$rootScope.popularizeShareJobEmailFrom = $scope.userName;	

		    $scope.popularizeShareJobEmailsubject =job.jobTitle + " at " + localStorage.getItem('companyName');
			
			var popularizeMailContent = '<div  class="emailInivteContentMainDiv" style=" font-family: sans-serif;font-size: 14px;margin-bottom: 0px;width:99%; display: inline-block;"><div><div style="padding-bottom: 10px;" class="emailInivteContentDivPadding">'
				+ '<div style="float: right;padding: 15px;padding-right: 50px; width:100%"><div></div>';
			if(job.companyLogo){
			
				popularizeMailContent += '<img style="max-height: 40px;float:right" ng-src="'+$scope.companyLogo+'"/><br>' ;
			
			}
			if(isEmployeeReferralEnabled=="true"){
				popularizeMailContent += '<div style="word-wrap: break-word;padding: 27px 27px 7px 50px;" id="shareJobEmailContentEdit" >Hi,</div>'
					
					+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 12px; line-height: 200%; text-align: left; color: #414242;margin-top: 20px;padding-left: 50px;" class="emailInivteContentDivPadding">'
	
					+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
				}
			else{
				popularizeMailContent += '<div style="word-wrap: break-word;padding: 27px 27px 7px 50px;outline: none;" id="shareJobForIJPEmailContentEdit" >Hi,</div>'
					
					+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 12px; line-height: 200%; text-align: left; color: #414242;margin-top: 20px;padding-left: 50px;" class="emailInivteContentDivPadding">'
	
					+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
				}
			
				 if(job.location != null && job.location != ""){
					
					 popularizeMailContent += 'Location : '+ '<span  style="color: #1155CC;">' +job.location+'</span><br>';
					
				}
				 
				if(job.skillSet != null && job.skillSet != ""){
					
					popularizeMailContent +='Mandatory Skills : '  + '<span  style="color: #1155CC;">' +job.skillSet+'</span><br>';
					
				}
				
				if(job.yrsOfExperience != null && job.yrsOfExperience != ""){
				
					popularizeMailContent += 'Experience : ' + '<span  style="color: #1155CC;">' +job.yrsOfExperience+'</span>';
					
				}
				var http = "http://"+localStorage.getItem('careerSiteUrl');
				
				
				
				if(isEmployeeReferralEnabled=="true"){
					var http = "http://"+job.careerSiteUrl;
				popularizeMailContent += "</div>";
				popularizeMailContent += "<div style='display: inline-block;width: 100%; padding:0px 50px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:0px 11% 0px 50px;font-size:14px;display: inline-block;margin-bottom:20px;' class='emailInivteContentDivPadding'>";
				popularizeMailContent += "You can view the details of the job and apply ";
				popularizeMailContent += "<a target='_blank' style='color:#2989CA;text-decoration:underline;'";
				popularizeMailContent +=  "href=";
				popularizeMailContent +=  http +"/#!/job-view/"+job.jobUrl+"/?source=EmployeeReferral&subSource=referralInvite&ref="+$rootScope.uuid+">";
				popularizeMailContent +=  "here</a></div>";
				popularizeMailContent +=  "<div class='shareJobEmailSeperator'></div>";
				 $scope.popularizeShareJobEmailContent = popularizeMailContent;
				}else{
					var http = "http://"+job.careerSiteUrl+"/referral";
					popularizeMailContent += "</div>";
					popularizeMailContent += "<div style='display: inline-block;width: 100%; padding:0px 50px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:0px 11% 0px 50px;font-size:14px;display: inline-block;margin-bottom:20px;' class='emailInivteContentDivPadding'>";
					popularizeMailContent += "You can view the details of the job and apply ";
					popularizeMailContent += "<a target='_blank' style='color:#2989CA;text-decoration:underline;'";
					popularizeMailContent +=  "href=";
					popularizeMailContent +=  http +"/#/viewjob/"+jobID+">";
					popularizeMailContent +=  "here</a></div>";
					popularizeMailContent +=  "<div class='shareJobEmailSeperator'></div>";
					 $scope.popularizeShareJobForIJPEmailContent = popularizeMailContent;
				}
		
			   
			   
		 
			});
	 
	 };
	 
	
		      $scope.shareJobEmailContentEdit = function() {
		    	  document.getElementById("shareJobEmailContentEdit").contentEditable = true;
		    	  document.getElementById("shareJobEmailContentEdit").focus();
		      }
		      $scope.shareJobForIJPEmailContentEdit = function() {
		    	  document.getElementById("shareJobForIJPEmailContentEdit").contentEditable = true;
				  document.getElementById("shareJobForIJPEmailContentEdit").focus();
		      }

			
			$scope.inviteFriendsPreviewContent = function(){
				 $rootScope.inviteFriendsEmailContent = $rootScope.inviteFriendsEmailContent === true ? false : true;
				
			};
			
			$scope.clearuploadcvdata = function(){
				
				
				var emailid=document.getElementById('emailid').value = '';
				var emailid=document.getElementById('emailid').value = '';
				var emailid=document.getElementById('emailid').value = '';
				
				
				
				$('#emailid').val('');
        if(emailid!=null)
	       {
	               $scope.uploadCvForm.email.$error.pattern=false;
	       }
        if($scope.uploadCvForm.phonenumber.$error.pattern=='true' || $scope.uploadCvForm.phonenumber.$error.pattern==true ){
     	   $scope.uploadCvForm.phonenumber.$error.pattern=false;
        }
        
        if($scope.uploadCvForm.experience.$error.pattern=='true' || $scope.uploadCvForm.experience.$error.pattern==true )
     	   {
     	            $scope.uploadCvForm.experience.$error.pattern=false;
     	   }
		}
			
			$scope.FbImg = 'images/fb.png';
			$scope.TwtrImg = 'images/twitr.png';
			$scope.LinkedinImg = 'images/in.png';
			$scope.GplusImg =  'images/gplus.png';
		 $scope.inviteCandidatePopUp = function(job){
			    $rootScope.emailInivteContent = null;
				$rootScope.inviteFriendsEmailContent = false;

			    $rootScope.emailErrInvitePopularize=false;
			    
			    $rootScope.jobId = job.id;
			    
			    $scope.jobTitle = job.jobTitle;
				
				$scope.location = job.location.split(';').join('/');
			    
			    $scope.experience = job.yrsOfExperience;
			    
			    $scope.careerSiteLogo = localStorage.getItem('careerSiteLogo');
			    
			    //Email Content For Invite Friends :
					
				$scope.$parent.emailInivteSubject =job.jobTitle + " at " + localStorage.getItem('companyName') + " - Invite to apply" ; 				
				var mailContent = '<div  class="emailInivteContentMainDiv" style=" font-family: arial; border: solid 1px;font-size: 18px;margin-bottom: 0px;width:99%; display: inline-block;"><div><div id="previewContent" style=" padding: 35px;padding-bottom: 10px;" class="emailInivteContentDivPadding">'
					+ '<div><div></div>';
				
				if($scope.careerSiteLogo != null && $scope.careerSiteLogo != "" && $scope.careerSiteLogo != "null"){
	        		$scope.companyLogoImageUrl = "https://"+localStorage.getItem('careerSiteUrl')+"/images/"+$scope.careerSiteLogo;
	        		
	        		mailContent += '<img style="max-height: 40px;float:right" ng-src="'+ $scope.companyLogoImageUrl +'"/><br>';
				}
				mailContent += '<br></div>' 
					+ 'Hi,<br><br>'
				+ $scope.welUserName + ' would like to invite you to apply for the job '
				+ '<b>'+job.jobTitle + '</b> at'
				+ "<b> "+localStorage.getItem('companyName') +'</b><img id="cursorBlinking" style="display:none;height: 18px;"src="images/cursor.gif"/></div>'
				

				+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 17px; text-align: left; color: #414242;margin-top: 5px;padding-left: 36px;" class="emailInivteContentDivPadding">'

				+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
				
				 if(job.location != null){
					
					 mailContent += 'Location : '+ '<span  style="color: #1155CC;">' +job.location+'</span><br>';
					
				}

				if(job.skillSet != null){
					
					mailContent +='Mandatory Skills : '  + '<span  style="color: #1155CC;">' +job.skillSet+'</span><br>';
					
				}
				
				if(job.yrsOfExperience != null){
				
					mailContent += 'Experience : ' + '<span  style="color: #1155CC;">' +job.yrsOfExperience+'</span>';
					
				}
				var http = "https://"+localStorage.getItem('careerSiteUrl');
				
				$rootScope.emailInivteContent = mailContent;

				mailContent += " </div>";
				mailContent += "<div style='display: inline-block;width: 100%; padding: 10px 35px;font-size: 17px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:10px 11% 0px 35px;font-size:16px;display: inline-block;' class='emailInivteContentDivPadding'>";
				
				mailContent += " <a id='viewapplybutton' class='viewapplybtn' style='color:#fff;text-decoration: none !important;display: inline-block;padding: 10px 12px;background:#5491ca;' target='_blank'";
				mailContent +=  " href=";
				mailContent +=  http +"/#!/job-view/"+job.jobUrl+"/?source=referralInvite&ref="+$rootScope.uuid+">";
				mailContent +=  "View and apply to this job opening</a></div>";
				mailContent += "<div class='emailInivteContentDivPadding' style='display: block;padding:10px 35px 0px ;vertical-align:text-top;margin-top:10px;'><p style='font-size:16px;vertical-align: 7.5px;display: inline;margin-right:10px;'>Share this job with your network</p><a style='padding: 0px 1px 0px 0px' custom-url="+"http://"+localStorage.getItem('careerSiteUrl')+"/#!/job-view/"+job.jobUrl+"/?source=facebookShare&ref="+$rootScope.uuid+" social-facebook><img src="+$scope.FbImg+" alt='Facebook' title='Facebook' style='height:25px;' /></a>";
				//mailContent +='<a style="padding: 0px 1px 0px 0px " status="{{job.jobTitle}} - http://{{"http://"+localStorage.getItem('careerSiteUrl')}}/#!/job-view/{{job.jobUrl}}/?source=twitter&referrer={{userName}}" social-twitter><img ng-src="{{TwtrImg}}" alt="Twitter" title="Twitter" style="height:25px;"/></a>';
				mailContent +="<a style='padding: 0px 1px 0px 0px'";
				mailContent +=	"status=";
				//mailContent += str+"-";
				mailContent += http + "/#!/job-view/" +job.jobUrl + "/?source=share-twitter&ref="+$rootScope.uuid;
				mailContent += " social-twitter><img src="+$scope.TwtrImg+" alt='Twitter' title='Twitter' style='height:25px;'/></a>";
				mailContent +=	"<a style='padding: 0px 1px 0px 0px'";
				mailContent +=	"custom-url=";
				mailContent +=	http + "/#!/job-view/" +job.jobUrl + "/?source=share-linkedin&ref="+$rootScope.uuid;
				mailContent += " social-linkedin><img src="+$scope.LinkedinImg+" alt='LinkedIn' title='LinkedIn' style='height:25px;' /></a>";
				mailContent +=	"<a style='padding: 0px 1px 0px 0px'";  
				mailContent +=	"custom-url="
				mailContent += http +"/#!/job-view/" +job.jobUrl+ "/?source=googleplus&ref="+$rootScope.uuid;
				mailContent += " social-gplus><img src="+$scope.GplusImg+" alt='Google+' title='Google+' style='height:25px;' /></a></div></div><div style='display: inline-block; width: 100%; padding:10px 35px 35px;font-size: 17px;'></div></div></div>";			
					
			    $rootScope.emailInivteContent = mailContent;
			    $rootScope.emailInivteContent= $sce.trustAsHtml($rootScope.emailInivteContent);
					
		   }
		   
		   
		   $rootScope.emailErrInvitePopularize = false;
	  
	 $scope.sendInviteCandidatesEmail = function(status){
		 var errorFound = "no";
		 var fromMailErrorFound = "no";
		 var errorFoundForNoEmail = "no";
		 var errorFoundForNoFromEmail = "no";
		 var errorFoundForNoSubject = "no";
		 var emailTags = null;
		 var inviteCandidatesEmailIdList = [];
		 var index=0;
		 $rootScope.errEmailId = false;
		 $rootScope.errFromEmailAddress = false;
		 $scope.emailFrom = $scope.popularizeShareJobEmailFrom;
		 
		 if(status == 'C'){
			 
			 emailTags = $rootScope.emailInivteContent;
			 $scope.editedEmailContent= document.getElementById('emailContent').innerHTML ;
			 $scope.emailSubject = $scope.emailInivteSubject;
			 
		 } else if(status == 'E') {
		 
		     emailTags = $scope.jobsPopularizeTags;
		     
		     if(isEmployeeReferralEnabled=="true"){
		    	 $scope.editedEmailContent= document.getElementById('shareJobEmailContent').innerHTML ;
		     }
		     else{
		    	 $scope.editedEmailContent= document.getElementById('shareJobForIJPEmailContent').innerHTML ;
		     }
		     $scope.emailSubject = $scope.popularizeShareJobEmailsubject;
		     
		     $scope.emailFrom = $scope.popularizeShareJobEmailFrom;
		     
		     
		 } else {
			 emailTags = $scope.jobsPopularizeTags;
			 $scope.editedEmailContent= document.getElementById('popularizeEmailContent').innerHTML ;
			 $scope.emailSubject = $scope.popularizeEmailInivteSubject;
			
		 }
		 
		 $rootScope.jobId=localStorage.getItem('JobId');
		  if(emailTags == null || emailTags == '' ){
				 
				$rootScope.emailErrInvitePopularize = true;
				errorFoundForNoEmail = "yes";
				
		  } else {
			  
			  errorFoundForNoEmail = "no";
		  } 
		 
	  
	// email validation for tags
		  
	 emailTags = JSON.stringify(emailTags);
	 var inviteCandidateTagsSplit = emailTags.split(',');
	
	  for(index=0; index < inviteCandidateTagsSplit.length;index++){
		  var strold = inviteCandidateTagsSplit[index];
		  
			var strnew = strold.substr(9, strold.length-11);
			
			strnew =  strnew.replace(/['"]+/g, '');
			
			  if ((strnew.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(strnew) && errorFound == "no"))  
			  { 
				  inviteCandidatesEmailIdList.push(strnew);
			   
			 } else {
				errorFound = "yes";
				$rootScope.errEmailId = true;
				
			 } 
			  
	  }
	  
	  if(status == 'E') {
		  
		  if($scope.emailFrom == null || $scope.emailFrom == '' ){
			    $rootScope.errFromEmailAddress = false;
				$rootScope.fromEmailErr = true;
				errorFoundForNoFromEmail = "yes";
				
		  } else {
			  
			  errorFoundForNoFromEmail = "no";
		  } 
		  
		  if($scope.emailSubject == "") {
		      $rootScope.errFromEmailSubject = true;
		      errorFoundForNoSubject = "yes";
		  } else {
			  
			  errorFoundForNoSubject = "no";
		  }
		    
		   // email validation for from email address
		    var emailId = $scope.emailFrom; 
		  
		    if ((emailId.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(emailId) && fromMailErrorFound == "no"))  
		    { 
		    	$rootScope.errFromEmailAddress = false;
		    } else {
		    	fromMailErrorFound = "yes";
		    	$rootScope.fromEmailErr = false;
		    	$rootScope.errFromEmailAddress = true;
		    	
		    }
	  }
	  
		var inviteEmail = inviteCandidatesEmailIdList;
		 
		if(errorFound == "no" && errorFoundForNoEmail == "no" && fromMailErrorFound == "no" && errorFoundForNoFromEmail == "no" && errorFoundForNoSubject == "no" ){
			 $activityIndicator.startAnimating();
			 
			 var fromEmail = "";
			 
			 if(status == 'E') {
				 fromEmail = $scope.emailFrom;
			 }else{
				 fromEmail = userName;
			 }
			 
			 $scope.loggedAdminIdAdminId=localStorage.getItem('loggedAdminIdAdminId');
	   		  if($scope.loggedAdminIdAdminId==null || $scope.loggedAdminIdAdminId=='undefined'){
	   				$scope.loggedAdminIdAdminId=0;
	   			}
				 $scope.sessionId=localStorage.getItem('sessionId');
		         $scope.loginUserId=localStorage.getItem('loginUserId');
		 services.sendInviteCandidatesEmail(status,inviteEmail, $scope.jobId, fromEmail, growl, $scope.editedEmailContent, $scope.emailSubject).then(function (response) {
			 $activityIndicator.stopAnimating();
	    	 $('#closeInviteCandidatePopup').click();
			 $('#closePopularizePopup').click();
			 $('#closeShareJobEmailPopup').click();
			 $('#closeShareJobForIJPEmailPopup').click();			 
			 $scope.cancelInvites();
			 
			 if (response.data.webserviceAPIResponseCode == UNAUTHORIZED){
				 growl.error(UNAUTHORIZED_ERROR_MSG,{ttl:5000});
				 $('#logout').click();
				 return;
			 }
			 
			 if (response.status == 200 && response.data.code == 200 && status == 'C') {
				 $activityIndicator.stopAnimating();
				 growl.success(ClientEmpRefInviteCandidateSuccessMessage,{ttl:5000}); //new message
				 //growl.success("Invitation sent successfully"); old message
				
            }else if (response.status == 200 && response.data.code == 200 && status == 'P') {
            	 $activityIndicator.stopAnimating();
            	 growl.success(ClientEmpRefRequestToPopularizeSuccessMessage,{ttl:5000}); // new message
				 //growl.success("Request to popularize has been sent successfully"); old message
				
            }else if (response.status == 200 && response.data.code == 200 && status == 'E') {
           	     $activityIndicator.stopAnimating();
           	     growl.success(ClientEmpRefEmailInviteSuccessMessage,{ttl:5000}); //new message
				 //growl.success("Email sent successfully"); old message
				 
            } else {
            	 growl.error(CommonFailureMessage,{ttl:5000}); //new message
				 //growl.error("Something went wrong. Please try again."); old message
				 
			 }
            return;
			
			});	
		 }
		
	 };
		   
		   
		   
				
				$scope.emailErrInvitePopularize = false;
				  
				 $scope.sendInviteFriendsEmail = function(){
					 
					 $activityIndicator.startAnimating();
					 $('#previewContent').css('border','none');
					 $('#previewContent').css('margin','0px');
					 $('#cursorBlinking').css('display','none');
					 $('#viewapplybutton').css('display','inline-block');
					 var errorFound = "no";
					 var fromMailErrorFound = "no";
					 var errorFoundForNoEmail = "no";
					 var errorFoundForNoFromEmail = "no";
					 var errorFoundForNoSubject = "no";
					 var emailTags = null;
					 var inviteCandidatesEmailIdList = [];
					 var index=0;
					 $rootScope.errEmailId = false;
					 $rootScope.errFromEmailAddress = false;
					 
					 emailTags = $rootScope.emailInivteContent;
						 
					 $scope.editedEmailContent= document.getElementById('emailContent').innerHTML;
					 $scope.emailSubject = $scope.emailInivteSubject;
					
					  if(emailTags == null || emailTags == '' ){
						  
						  $activityIndicator.stopAnimating();
						  $rootScope.emailErrInvitePopularize = true;
						  errorFoundForNoEmail = "yes";
							
					  } else {
						  
						  errorFoundForNoEmail = "no";
					  } 
					  
				 emailTags = JSON.stringify(emailTags);
				 var inviteCandidateTagsSplit = emailTags.split(',');
				
				  for(index=0; index < inviteCandidateTagsSplit.length;index++){
					  var strold = inviteCandidateTagsSplit[index];
					 
						var strnew = strold.substr(9, strold.length-11);
						
						strnew =  strnew.replace(/['"]+/g, '');
						
						  if ((strnew.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(strnew) && errorFound == "no"))  
						  { 
							  inviteCandidatesEmailIdList.push(strnew);
						   
						  } else {
							  $activityIndicator.stopAnimating();
							  errorFound = "yes";
							  $rootScope.errEmailId = true;
						 } 
				  }
				  
				  
					var inviteEmail = inviteCandidatesEmailIdList;
					
					if(errorFound === "no" && errorFoundForNoEmail === "no" && fromMailErrorFound == "no" && errorFoundForNoFromEmail == "no" && errorFoundForNoSubject == "no" ){
					
				    var fromEmail = localStorage.getItem('referraluserName');
				    $scope.loggedAdminIdAdminId=0;
					$scope.referralsessionId=localStorage.getItem('referralsessionId');
					var jobId =  localStorage.getItem('JobId');
					$scope.referralloginUserId =  localStorage.getItem('referralloginUserId');
					
	var referralloginUserId = localStorage.getItem('referralloginUserId');
					
					var userId = referralloginUserId;
					
				    var referralsessionId = localStorage.getItem('referralsessionId');

					services.sendInviteCandidatesEmail('P',inviteEmail, $rootScope.jobId, fromEmail, growl, $scope.editedEmailContent, $scope.emailSubject).then(function (response) {
						 
				    	$('#closeInviteFriendsPopup').click();
						$scope.cancelInvites();
						
						if (response.status == 200 && response.data.code == 200) {
							 $activityIndicator.stopAnimating();
							 growl.success(ClientEmpRefEmailInviteSuccessMessage,{ttl:5000}); //new message
							 //growl.success("Invitation sent successfully"); old message
							
			            } else {
			            	growl.error(CommonFailureMessage,{ttl:5000}); //new message
			            	//growl.error("Something went wrong. Please try again."); old message
			            }
						
						});	
					 }
					
				 };
				 
				 $scope.cancelInvites = function(){

				   $rootScope.emailInivteContent = null;	  
				   $rootScope.emailInivteContent = null;
				   $rootScope.emailErrInvitePopularize=false;
				   $rootScope.errEmailId =  false;
				   $rootScope.fromEmailErr = false;
				   $rootScope.errFromEmailAddress = false;
				   $rootScope.errFromEmailSubject = false;
				   $rootScope.popularizeShareJobEmailFrom = null;
				  // $scope.emailInivteSubject = null;
				   $('#subjectEditContent').prop('disabled', true);
				   $('#previewContent').css('border','none');
				   $('#previewContent').css('margin','0px');
				   $('#cursorBlinking').css('display','none');
				
			     };
		 
	 
	 
	 
	 /*$scope.sendNotification = true;
		
		var sendNotification = "";
		
		$scope.saveUploadCv = function() {
			
			$activityIndicator.startAnimating();
			
			var isFormValid = false;
			
			var userName = localStorage.getItem('referraluserName');
			
			if ($scope.fileSizeValidation == true) {
			
			var file = fileUpload.files[0];
			
			if (typeof file == "undefined") {
     		file = "null";
     		$scope.resumeRequiredErr = "yes";
     		
     	}else{
     		isFormValid = true;
     	}
			
			if(isFormValid){
				
			var fileName = file.name;
			
			if($scope.sendNotification){
 			 sendNotification = "Yes";
			} else {
				 sendNotification = "No";
			}
			
			var jobId =  localStorage.getItem('JobId');
			
			var referralloginUserId = localStorage.getItem('referralloginUserId');
			
			var userId = referralloginUserId;
			
		    var referralsessionId = localStorage.getItem('referralsessionId');
				
		    if(referralsessionId != "" && referralsessionId !='empty' && referralsessionId !=null) {
		    	$('#closeUploadCvPopup').click();
			services.addProfile($scope.JobApplication, jobId, file, growl, fileName, userName, userId, sendNotification, referralsessionId,referralloginUserId)
 		.then(function(response) {
 			$activityIndicator.stopAnimating();
 			 $('#uploadCvPopup').modal('hide');
				if (response.data.code == 200) {
					  growl.success(ClientEmpRefUploadProfileSuccess); //new message
					 //growl.success("Profile uploaded successfully"); old message
					
	            } else if(response.data.code == 500){
					
					growl.error(response.data.message);
					
				}else {
					growl.error(CommonFailureMessage); //new message
	            	//growl.error("Something went wrong. Please try again."); old message
	            	
	            }
 			
 		  });
			
		     }
					
		   }
		  
		  }
		}*/


/*$scope.addProfilePopup = function( job_title, location , job_experience) {
			 $scope.jobTitle = job_title;
				$scope.location = location.split(';').join('/');
				
				$scope.experience = job_experience;
			
				
				$scope.JobApplication = null;
				$scope.JobApplication={};
				$scope.fileName=null;
				 $activityIndicator.startAnimating();
				 to get apply fields 
				 $scope.filetype = "valid"; 
				 $scope.fileSizeExceededErr=false;
				
				 
					services.getApplyFields().then(function(data){
						
						$rootScope.getApplyFields = data.data;	
						
						$activityIndicator.stopAnimating();
						
					});
				
			 };*/

			   // resume parser jov view
		        $scope.resumeParserjobView = function(){
		   			 
		   			var file = fileUpload.files[0];
		   			var fileName= file.name;
		   			$activityIndicator.startAnimating();
		   			services.resumeParser(file,fileName)
		    		.then(function(data) {
		    			
		    			$activityIndicator.stopAnimating();
		    			if(data.data != null){ 
		    				var jobApplication = data.data;
		    				$scope.JobApplication.firstName = null;
							$scope.JobApplication.emailId = null;
							$scope.JobApplication.phoneNo = null;
							$scope.JobApplication.firstName = jobApplication.firstName;
							$scope.JobApplication.emailId = jobApplication.emailId;
							$scope.JobApplication.phoneNo = jobApplication.phoneNo;
		    			} 
		    		
		    		});
		   		 }
	 
});

ccubeApp.controller('leaderBoardController', function($scope,Pagination,localStorageService,$activityIndicator,services,xdLocalStorage,growl,$rootScope,$location) {
	
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	
	$scope.companyName = localStorage.getItem('companyName');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	
	if($scope.welUserName === null){
    	sessionStorage.setItem('managePagePath', "leaderboard");
	   	$location.path('/');
		return;
	}
	$rootScope.jobLimit = 5;
	$scope.toggleLaeder = "yes";
    $scope.togglemyReferral = "no";
	$scope.togglehome = "no";
	$scope.toggleijp = "no";
    $scope.toggleBenefits = "no";
    $scope.togglemyRedeemPoints= "no";
    $scope.toggleCompanyPolicy = "no";
    $scope.togglemyApplies = "no";
    $scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
    var referralloginUserId=localStorage.getItem('referralloginUserId');
	
    $scope.formRedeem={};
	 $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
	 $scope.referralloginUserName = localStorage.getItem('referraluserName');
	services.getAllPointsDetailsForEmployee($scope.referralloginUserId, $scope.referralloginUserName).then(function(data){
   	 $scope.formRedeem.pointsAvailed=data.data.pointsAvailed;
   	 $scope.formRedeem.totalPoints=data.data.totalPoints;
   	 $scope.formRedeem.pointsPending=data.data.pointsPending;
   	 $scope.formRedeem.currentPoint=data.data.currentPointBalance;
   	 $scope.currentPoint=data.data.currentPointBalance;
   	
    });
    
	 $scope.init = function() {
		 
		 	this.leaderBoardList();
		    this.leaderBoardDetails();
			this.employeeReferralHistory();
		};


		if ($scope.welUserName === null){

	  	 
				 $location.path('/login');
			 }
	
	$scope.leaderBoardList = function() {
		
		 $activityIndicator.startAnimating();
		services.getLeaderBoardList().then(function(data) {
			 $activityIndicator.stopAnimating();
			$scope.leaderBoardList = data.data;
			 $scope.leaderBoardListLength = $scope.leaderBoardList.length;
			 
				$scope.pagination = Pagination.getNew(8);
		       $scope.pagination.numPages = Math.ceil($scope.leaderBoardList.length/$scope.pagination.perPage);
		       $scope.pageSize = 8;
		       
		       $rootScope.totalRecords = $scope.leaderBoardList.length;
		       
		       $rootScope.totalNoOfPages =  $scope.pagination.numPages;
		});

	}
		
	$scope.leaderBoardDetails = function() {
		 
		 
		 var userName = localStorage.getItem('referraluserName');
		 services.getLeaderBoardDetails(referralloginUserId, userName).then(
					function(data) {
				
			 $scope.leaderBoardDetails = data.data;		 
			 localStorage.setItem('totalRank', $scope.leaderBoardDetails.totalRanks);	
			 $scope.totalRank = localStorage.getItem('totalRank');
			 localStorage.setItem('employeeRank', $scope.leaderBoardDetails.employeeRank);
		     $scope.employeeRank = localStorage.getItem('employeeRank');
			 
						
		 });
		 
	 }
	$scope.employeeReferralHistory = function() {
		services.getEmployeeReferralHistory().then(function(data) {

			$scope.employeeReferralHistory = data.data;
			for(var index = 0; index < $scope.employeeReferralHistory.length; index++) {
				
				  var now = new Date().getTime();
				  var regDate = $scope.employeeReferralHistory[index].referralDate;
				  var diff=now-regDate;
			
			var n = (now - regDate)/1000;
			
			if(n < 3600){
				 var diff = 'Just Now'
			}
			else if(n < 86400){
				 var hours_n = Math.floor(n/3600);
				 var diff= hours_n + ' Hour' + (hours_n > 1 ? 's' : '') + ' Ago';
				
			}
			else if (n < 2629743) { // less than a week
	             var day_n = Math.floor(n/86400);
	             var diff= day_n + ' Day' + (day_n > 1 ? 's' : '') +' Ago';
	           
			 } 

			 else if (n < 31556926) { // less than 12 months
	             var month_n = Math.floor(n/2629743);
	             var diff= month_n + ' Month' + (month_n > 1 ? 's' : '') +' Ago';
	                 
			 } else { 
	             var year_n = Math.floor(n/31556926);
	             var diff= year_n + ' Year' + (year_n > 1 ? 's' : '') +' Ago';
	               
			 }
			$scope.employeeReferralHistory[index].referralDateAgo =diff;
			  
			  }
	       
		});

	}
	 
});

ccubeApp.controller('mainController', function($scope,localStorageService,Pagination,$activityIndicator,services,xdLocalStorage,growl,$rootScope,$location,$sce,$compile,internationalizationService) {

	
	$('.clearSearch').hide(); 
	
	$rootScope.moduleName="Referral";
	$rootScope.subModuleName = "Referral";
	var absUrlForReferral = $location.absUrl();
	if (absUrlForReferral.includes("candidatereferral")) {
		$rootScope.subModuleName = "CandidateReferral";
	}
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	$scope.enableIjp=localStorage.getItem('enableIjp');

	if($scope.welUserName === null){
		if($location.absUrl().indexOf("home") > -1 && $location.absUrl().indexOf("viewjob") < -1 ){
			sessionStorage.setItem('managePagePath', "home");
		   	$location.path('/');
			return;
		}else if($location.absUrl().indexOf("job-list") > -1){
			sessionStorage.setItem('managePagePath', "job-list");
		   	$location.path('/');
			return;
		}else if($location.absUrl().indexOf("configure") > -1){
			sessionStorage.setItem('managePagePath', "configure");
		   	$location.path('/');
			return;
		}else if($location.absUrl().indexOf("companyPolicy") > -1){
			sessionStorage.setItem('managePagePath', "companyPolicy");
		   	$location.path('/');
			return;
		}else if($location.absUrl().indexOf("ijp") > -1 && $location.absUrl().indexOf("viewjob") < -1 ){
			sessionStorage.setItem('managePagePath', "ijp");
		   	$location.path('/');
			return;
		}
	}
	 
    $rootScope.job=null;
	$scope.byCashContentView="no";
	$scope.redeemByCashConfirmCheck="no";
	$scope.redeemByGiftConfirmCheck="no"; 
	$scope.byGiftContentView="no";
	$rootScope.goBackFomJobView = "#/job-list";
	$scope.userName = localStorage.getItem('referraluserName');
	$scope.ReferralEmailID = localStorage.getItem('referraluserName');
	$rootScope.jobLimit = 3;
	$scope.referalName = localStorage.getItem('referraluserName');
	$rootScope.uuid = localStorage.getItem('uuid');
	$scope.points = localStorage.getItem('points');
	$scope.submitAddProfile = false;
	$scope.toggleLaeder = "no";
    $scope.togglemyReferral = "no";
	$scope.togglehome = "yes";
	$scope.toggleijp = "no";
	$scope.showChangePassword = localStorage.getItem('isSSOLoginDisabled');

	if($location.path() == '/ijp'){
		$scope.toggleijp="yes"
		$scope.togglehome = "no";
		$scope.toggleLaeder = "no";
		$scope.togglemyReferral = "no";
		$scope.toggleBenefits = "no";
		$scope.togglemyRedeemPoints= "no";
		$scope.toggleCompanyPolicy = "no";
		$scope.togglemyApplies = "no";
	}

    $scope.toggleBenefits = "no";
    $scope.togglemyRedeemPoints= "no";
    $scope.toggleCompanyPolicy = "no";
    $scope.togglemyApplies = "no";
    $scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
    $rootScope.enableBulkUploadReferral = false;
    $scope.jobsPopularizeTags = [];
    var referralloginUserId=localStorage.getItem('referralloginUserId');
    
    $scope.formRedeem={};
	 $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
	 $scope.referralloginUserName = localStorage.getItem('referraluserName');
	services.getAllPointsDetailsForEmployee($scope.referralloginUserId, $scope.referralloginUserName).then(function(data){
		$scope.formRedeem.pointsAvailed=data.data.result.pointsAvailed;
		$scope.formRedeem.totalPoints=data.data.result.totalPoints;
		$scope.formRedeem.pointsPending=data.data.result.pointsPending;
		$scope.formRedeem.currentPoint=data.data.result.currentPointBalance;
		$scope.currentPoint=data.data.result.currentPointBalance;
   	
    });
	
	if(localStorage.getItem('referralsessionId') != 'null' && localStorage.getItem('referralsessionId') != null){
		services.getCompanyExtralnalConfig().then(function(data){
		   	localStorage.setItem('enableIjp',data.data.enableIjp);
		   	$scope.enableIjp=localStorage.getItem('enableIjp');
		   	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
		   	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
			localStorage.setItem('seoJobPreviewType',data.data.seoJobPreviewType);
		   	localStorage.setItem('companyName',data.data.companyName);
		   	localStorage.setItem('careerSiteUrl',$location.host());
		   	
		   	if(data.data.companyLogoName == "" || data.data.companyLogoName == null || data.data.companyLogoName == 'null'){
		   		$scope.companyName = data.data.companyName;
		   	}else{
		   		if(isLocal){
		   			$scope.imageSrcCompanyLogos = "../images/"+data.data.companyLogoName;
		   		}else {
		   			$scope.imageSrcCompanyLogos = "../../../images/"+data.data.companyLogoName;
		   		}
		   	}
			localStorage.setItem('companyLogo', $scope.imageSrcCompanyLogos);	
			localStorage.setItem('careerSiteLogo', data.data.companyLogoName);	
			$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');

		    });
	}
	
	$scope.$on('$viewContentLoaded', function() {
		
		 $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
		 $scope.referralloginUserName = localStorage.getItem('referraluserName');
		services.getAllPointsDetailsForEmployee($scope.referralloginUserId, $scope.referralloginUserName).then(function(data){
			$scope.formRedeem.pointsAvailed=data.data.result.pointsAvailed;
			$scope.formRedeem.totalPoints=data.data.result.totalPoints;
			$scope.formRedeem.pointsPending=data.data.result.pointsPending;
			$scope.formRedeem.currentPoint=data.data.result.currentPointBalance;
			$scope.currentPoint=data.data.result.currentPointBalance;
			
			console.log($scope.currentPoint);
			console.log($scope.togglemyRedeemPoints);
	   	
	    });
	});
    
    $scope.myreferralClick = function() {
		
		localStorage.setItem('operation', "null"); 
	};


	$scope.ijpClick= function() {

		localStorage.setItem('operation', "null"); 
	};


$scope.redeemPoints = function() {
		
		localStorage.setItem('operation', "null"); 
	};
				
	  var userName = localStorage.getItem('referraluserName');

	  //console.log("username : " +$scope.welUserName);
	  
	  $scope.activeJobs = function() {
		
		  $location.path('/job-list');
			
		};
		$scope.activeJobsIjp = function() {
		
			$location.path('/ijp');
			  
		  };
		
		$scope.allApplications = function() {
			localStorage.setItem('operation', "Applies"); 
			$location.path('/my-referral');
			$rootScope.operationSentence = "You are looking at Applications through your referrals"
				
		};
		

		$scope.referssourl = function() {
				services.getxoxoxssourl($scope.referralloginUserId).then(function(data){
						if(data.data.url != null && data.data.url != '') {
							window.open(data.data.url, '_blank');
							}
					else
							growl.error("Failed to fetch XOXO sso url ,Please try after some time.");
		            	});
			};
		
		$scope.initializeafterredeem = function() {
				$rootScope.showcashsuccess = "no";
				$rootScope.showxoxosuccess = "no";
			    $rootScope.issucessmsg="no";
			if($scope.redemtypevalues.length<2)
			{
				  if($rootScope.redemtypevalues[0].redemtypename=='Cash')
					{
						$rootScope.showcash = "yes";
					}
				    	
					else
					{
						$rootScope.showxoxo = "yes";
					}
			}
		};
		
	angular.element(document).ready(function () {
				$rootScope.showcashsuccess = "no";
				$rootScope.showxoxosuccess = "no";
		 		$rootScope.issucessmsg="no";
	        if($rootScope.redemtypevalues.length==1)
				{
					if($rootScope.redemtypevalues[0].redemtypename=='Cash')
					{
						$rootScope.selected.redemtypename="Cash";
						$rootScope.showcash = "yes";
					}
				    	
					else
					{
						$rootScope.selected.redemtypename="XOXO";
						$rootScope.showxoxo = "yes";
					}
				       
				}
		
		     	
	});


	services.getactiveRewardProviderlist().then(function(data){
		
		var redemtype=data.data.result;
		   if(redemtype.length>1)
		   {
			    
			    redemtype.unshift({"id":0,"redemtypename":"Select Redeem Type"});
			    $rootScope.redemtypevalues=redemtype;
			    
		   }
		else
		{
			$rootScope.redemtypevalues=redemtype;
		}
			  
			$rootScope.selected =redemtype[0];
	      	
		
	    });
	$rootScope.afterrewardoperation=function(type){
				
		   if($rootScope.redemtypevalues.length>1)
		   {
			    $rootScope.issucessmsg="yes";
		   }
		
		if(type=="XOXO")
			  {
				   $rootScope.showxoxosuccess = "yes";
				   $rootScope.showxoxo = "no";

			  }
			else
			{

				$rootScope.showcashsuccess = "yes";
				$rootScope.showcash = "no";

			}
		$rootScope.checkredeemhistory('init');
	 };
		
		
	$scope.redemoptions = function($event) {
		
		
					if(this.selected.redemtypename=='Cash')
					{
						 $rootScope.showcash = "yes";
						 $rootScope.showxoxo = "no";
					}
					else if(this.selected.redemtypename=='XOXO')
					{
						 $rootScope.showcash = "no";
						 $rootScope.showxoxo = "yes";
					}
					else
					{
						 $rootScope.showcash = "no";
						 $rootScope.showxoxo = "no";
					}
		};
		
		

		
		
	$rootScope.checkredeemhistory = function(pageno) {
		
		services.getRedeemptioncount().then(function(data){
			$rootScope.redemptioncount=data.data.result;
			var i=0;
			
			if(data.data.result>10 && pageno=='init')
			{
				pageno=0;
				var pagenolist="<a ng-click='checkredeemhistory(0)'>&laquo;</a>";
				while(i< data.data.result)
				{
					if(i==0)
						pagenolist+='<a class="active"  ng-click="checkredeemhistory('+pageno+++')" id="pageid'+pageno+'">'+pageno+'</a>';
					else
						pagenolist+='<a  ng-click="checkredeemhistory('+pageno+++')" id="pageid'+pageno+'">'+pageno+'</a>';
					i=i+10;
					if(i>=data.data.result)
						pagenolist+='<a ng-click="checkredeemhistory('+(pageno-1)+')">&raquo;</a>';
				}
			    document.getElementById("paginationpage").innerHTML='';
				var compiledElement = $compile(pagenolist)($rootScope); 
				$('#paginationpage').append(compiledElement)
				
			}
			else
			{
				 $('#paginationpage a.active').removeClass('active');
				 $("#pageid"+(pageno+1)).addClass("active");
				
			}
		});
		
		services.getRedeemptionDetails($scope.referralloginUserId,pageno).then(function(data){
			
				$rootScope.employeeReferralrewardHistoryList=data.data;
			   
			   });
		
		};
		


	$scope.ijpApplies = function() {
		localStorage.setItem('operation', "Applies"); 
		$location.path('/myApplies');
		$rootScope.operationSentence = "You are looking at Applications through your Applies"

	};

		$scope.ijpshortlistedList = function() {

		localStorage.setItem('operation', "ShortLists");
		$location.path('/myApplies');
		$rootScope.operationSentence = "You are looking at Shortlisted Candidates"

	};

	$scope.ijpjoinsList = function() {

		localStorage.setItem('operation', "Joins");
		$location.path('/myApplies');
		$rootScope.operationSentence = "You are looking at Joined Candidates"
   };

   $scope.ijpofferedList = function() {

	localStorage.setItem('operation', "Offers");
	$location.path('/myApplies');
	$rootScope.operationSentence = "You are looking at Offered Candidates"

};
	
	
			
		$scope.qualityProfiles = function() {
				 
			localStorage.setItem('operation', "Quality");
			$location.path('/my-referral');
			$rootScope.operationSentence = "You are looking at Quality Profiles"		
		};
				
		$scope.shortlistedList = function() {
					 
			localStorage.setItem('operation', "ShortLists");
			$location.path('/my-referral');
			$rootScope.operationSentence = "You are looking at Shortlisted Candidates"
						
		};
					
		$scope.offeredList = function() {
						 
			localStorage.setItem('operation', "Offers");
			$location.path('/my-referral');
			$rootScope.operationSentence = "You are looking at Offered Candidates"
							
		};
						
		 $scope.joinsList = function() {
							 
			 localStorage.setItem('operation', "Joins");
			 $location.path('/my-referral');
			 $rootScope.operationSentence = "You are looking at Joined Candidates"
		};
		
	  
		
		
	  var absUrl = $location.absUrl();
	  if(absUrl.indexOf("changePassword") < -1 || absUrl.indexOf("retriveYourPassword") < -1){


		  if (userName === null) {
		  	$location.path('/login');
		  }

		  }
      
	var userName = localStorage.getItem('referraluserName');
	
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	
	$scope.companyName = localStorage.getItem('companyName');
	
	 var limitStep = 5;
	 $scope.init = function() {
		 
		 $scope.dashboardDetails();
		 $scope.searchJobServiceCall();
		 $scope.getReferralSuggestions();
			
		};
		
		
	 if($rootScope.jobLimit){
		 $scope.limit = $rootScope.jobLimit;
		 
	 } else {
			 
		 $rootScope.jobLimit = limitStep;
		 $scope.limit = limitStep;
	 }
	
	 $scope.moreJobs = function() {
		    $scope.limit += limitStep;
		    
		    $rootScope.jobLimit = $scope.limit;
		};
			 
		 
	 $scope.clearValue = function(){
				delete $rootScope.fullJobList;
			}
			

		 $scope.setCurrentPage = function(n) {
			 
			 $rootScope.setCurrentPage = n;
			 
			 
		 }
		 
		
		 if($rootScope.setCurrentPage == undefined){
			 
			 $rootScope.setCurrentPage = 0;
		 }

			/*$rootScope.referralSuggestionsNewArray  = {};
			
			$rootScope.getReferralSuggestions = function() {
				 var referralloginUserId=localStorage.getItem('referralloginUserId');
				 alert("u");
			      services.getReferralSuggestions(referralloginUserId).then(function(data) {
				
			    	$rootScope.referralSuggestions = data.data;
			    	
			    	
			    	for(var i in $rootScope.referralSuggestions)
					{
			    		
			    		$rootScope.referralSuggestions[i].jobId;
			    		$rootScope.referralSuggestionsNewArray[$rootScope.referralSuggestions[i].jobId] =  $rootScope.referralSuggestions[i].totalNoOfJobReferrals;
			    		
					}
			    	
			    	
			    	
			    	$rootScope.referralSuggestionsLength = $scope.referralSuggestions.length;
			    	
				  });
				}*/
			
				services.getConfiguration().then(function(data){
				
				$scope.configurationValues = data.data;
				
				$rootScope.enableBulkUploadReferral = $scope.configurationValues.enableBulkUploadReferral;
				$scope.referralFeaturedPercent = $scope.configurationValues.referralFeaturedPoints;
				$rootScope.showEmployeeRank = $scope.configurationValues.showEmployeeRank;
				localStorage.setItem('showEmployeeRank',$rootScope.showEmployeeRank);
				$scope.referralApplyPoint = $scope.configurationValues.referralPointsRelevent;
				localStorage.setItem('eRHomePage',$scope.configurationValues.eRHomePage);
				$scope.HomeEnabled = localStorage.getItem('eRHomePage');
				
				$scope.ERPointsEnable = $scope.configurationValues.erpointsEnable;
				$scope.ERPolicyEnable = $scope.configurationValues.erpolicyEnable;
				
				//Save enableFindYourSpot flag
				localStorage.setItem('enableFindYourSpot', JSON.stringify($scope.configurationValues.enableFindYourSpot));
				localStorage.setItem('ijpEnableFindYourSpot', JSON.stringify($scope.configurationValues.ijpEnableFindYourSpot));

				localStorage.setItem('findYourSpotJobLimit', JSON.stringify($scope.configurationValues.findYourSpotJobLimit));
				
				$scope.EnableReferralReco = $scope.configurationValues.enableReferralReco;
				$scope.ReferralSuggestionList = $scope.configurationValues.referralSuggestionList;
				
				$rootScope.totalFeaturedPoints = Math.round($scope.referralApplyPoint + (($scope.referralApplyPoint * $scope.referralFeaturedPercent)/100));
				
			});
				$rootScope.customMenuList = [];
				$rootScope.customMenuLength = 0;
				$scope.sessionId=localStorage.getItem('referralsessionId');
			    if($scope.sessionId){
			    	services.getCompanyNewsFeed($scope.sessionId,"customMenu").then(
							function(data) {
								if(data.data != undefined && data.data.code == 200 &&
										data.data.result !=null	&& data.data.result.length >0 ){
									$rootScope.customMenuList = data.data.result;
									for(i=0 ; i < $rootScope.customMenuList.length ; i++){
										if($scope.customMenuList[i].toBeDisplayedByStatus == 'yes'){
											$rootScope.customMenuLength = $rootScope.customMenuLength +1;
										}
									}
								}else{
									$rootScope.customMenuList = [];
								}
							});
			    }
				
				
			
			$scope.getReferralMappingER = function(){
				if(localStorage.getItem('referralsessionId') !=null && localStorage.getItem('referralsessionId') !="undefined" ){
					services.getReferralMapping().then(function(data){
						$scope.referralMappings = data.data;
					});
					
				}
			}
			$scope.viewJobPage = function(id) {

				$rootScope.jobId = id;
				localStorage.setItem('JobId', $rootScope.jobId);
			    $location.path('/viewjob');
		
			}
		 		
			$scope.viewJobPageNewTab = function(id){
				$rootScope.jobId = id;
				localStorage.setItem('JobId', $rootScope.jobId);
			    window.open( '#/viewjob/', '_blank');
			}

			$scope.viewJobPageNewTabijp = function(id){
				$rootScope.jobId = id;
				localStorage.setItem('JobId', $rootScope.jobId);
			    window.open( '#/viewjob/?source=ijp', '_blank');
			}
			$scope.viewJobPageNewTabrefer = function(id){
				$rootScope.jobId = id;
				localStorage.setItem('JobId', $rootScope.jobId);
			    window.open( '#/viewjob/?source=refer', '_blank');
			}

			


			
			$scope.fileSizeValidation = true;
            $scope.setFileName = function(fileInput) {
	           var filename = null;    		
	
	    		var validFileExtensions = TEXT_FILE_TYPES;   
	              var sFileName =fileInput.value;
	              
	                    for (var j = 0; j < validFileExtensions.length; j++) {
	                        var sCurExtension = validFileExtensions[j];
	                        if (typeof fileUpload.files[0] != "undefined" &&  sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
	                        	$scope.filetype = "valid";
	                            break;
	                            
	                        }else{
	                        	$scope.filetype = "invalid";
	                        }
	                    }
	                    
	    		$scope.resumeRequiredErr = "no";
	    		$scope.fileSizeExceededErr = "";
	    		 //limit files size to <=2MB
	    		if(typeof fileUpload.files[0] != "undefined" && fileUpload.files[0].size > 2097152){
	    			$scope.fileSizeExceededErr = "The file size exceeds the allowed limit"; 
	    			$scope.fileSizeValidation = false;
	    		}else{$scope.fileSizeValidation = true;}
	    		var file = fileInput.value;
	    		var filename = file.replace(/^.*[\\\/]/, '');
	    		
	    		$scope.fileName = '';
	    		$scope.$apply();
	    		$scope.fileName = filename;
	    		$scope.$apply();
	    		
    	    };
			    
			$scope.reloaddashboard = function() {
				 
				 var referralloginUserId=localStorage.getItem('referralloginUserId');
				 
				 var userName = localStorage.getItem('referraluserName');
				 
				 services.getDashboardDetails(referralloginUserId, userName).then(
							function(data) {
						
					 $scope.dashboardDetails = data.data;
					 
					 $scope.jobactiveLength = $scope.dashboardDetails.jobs;
								
				 });
				 
				 
			 }

			$scope.inviteFriendsEmailSubjectEdit = function(){
				
			    $('.emailInivteSubjectInput').css('background-color','#fff');
			    $('.popularizeEmailInivteSubjectInput').css('background-color','#fff');
			    $('#subjectEditContent').prop('disabled', false);
			    $('#subjectEditContentPopularize').prop('disabled', false);
			    document.getElementById("subjectEditContentPopularize").focus();
			    document.getElementById("subjectEditContent").focus();
					
			 };
			 
			 $scope.inviteFriendsEmailContentEdit = function(){
						
				$('.emailInivteContentDiv').css('background-color','#fff');
				$('#previewContent').css('border','1px dashed');
				$('#previewContent').css('margin','10px');
				$('#cursorBlinking').css('display','inline-block');
				document.getElementById("previewContent").contentEditable = true;
				
			 };
			
			
			$scope.inviteFriendsPreviewContent = function(){
				 $rootScope.inviteFriendsEmailContent = $rootScope.inviteFriendsEmailContent === true ? false : true;
				
			};
			
			$scope.clearuploadcvdata = function(){
				
				
				var emailid=document.getElementById('emailid').value = '';
				var emailid=document.getElementById('emailid').value = '';
				var emailid=document.getElementById('emailid').value = '';
				
				
				
				$('#emailid').val('');
           if(emailid!=null)
	       {
	               $scope.uploadCvForm.email.$error.pattern=false;
	       }
           if($scope.uploadCvForm.phonenumber.$error.pattern=='true' || $scope.uploadCvForm.phonenumber.$error.pattern==true ){
        	   $scope.uploadCvForm.phonenumber.$error.pattern=false;
           }
           
           if($scope.uploadCvForm.experience.$error.pattern=='true' || $scope.uploadCvForm.experience.$error.pattern==true )
        	   {
        	            $scope.uploadCvForm.experience.$error.pattern=false;
        	   }
		}
			
		
			$scope.FbImg = 'images/fb.png';
			$scope.TwtrImg = 'images/twitr.png';
			$scope.LinkedinImg = 'images/in.png';
			$scope.GplusImg =  'images/gplus.png';
			
			$scope.inviteCandidatePopUp = function(job){
				var emailTags = null;
				$scope.inviteCandidateTags =null;
			    $rootScope.emailInivteContent = null;
				$rootScope.inviteFriendsEmailContent = false;

			    $rootScope.emailErrInvitePopularize=false;
			    
			    $rootScope.jobId = job.id;
			    
			    $rootScope.jobTitle = job.jobTitle;
				
				$rootScope.location = job.location.split(';').join('/');
			    
			    $rootScope.experience = job.yrsOfExperience;
			    
			    $rootScope.careerSiteLogo = localStorage.getItem('careerSiteLogo');
			    
			    //Email Content For Invite Friends :
					
				$scope.$parent.emailInivteSubject =job.jobTitle + " at " + localStorage.getItem('companyName') + " - Invite to apply" ; 				
				var mailContent = '<div  class="emailInivteContentMainDiv" style=" font-family: arial; border: solid 1px;font-size: 18px;margin-bottom: 0px;width:99%; display: inline-block;"><div><div id="previewContent" style=" padding: 35px;padding-bottom: 10px;" class="emailInivteContentDivPadding">'
					+ '<div><div></div>';
				
				if($scope.careerSiteLogo != null && $scope.careerSiteLogo != "" && $scope.careerSiteLogo != "null"){
	        		$scope.companyLogoImageUrl = "https://"+localStorage.getItem('careerSiteUrl')+"/images/"+$scope.careerSiteLogo;
	        		
	        		mailContent += '<img style="max-height: 40px;float:right" ng-src="'+ $scope.companyLogoImageUrl +'"/><br>';
				}
				mailContent += '<br></div>' 
					+ 'Hi,<br><br>'
				+ $scope.welUserName + ' would like to invite you to apply for the job '
				+ '<b>'+job.jobTitle + '</b> at'
				+ "<b> "+localStorage.getItem('companyName') +'</b><img id="cursorBlinking" style="display:none;height: 18px;"src="images/cursor.gif"/></div>'
				

				+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 17px; text-align: left; color: #414242;margin-top: 5px;padding-left: 36px;" class="emailInivteContentDivPadding">'

				+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
				
				 if(job.location != null){
					
					 mailContent += 'Location : '+ '<span  style="color: #1155CC;">' +job.location+'</span><br>';
					
				}

				if(job.skillSet != null){
					
					mailContent +='Mandatory Skills : '  + '<span  style="color: #1155CC;">' +job.skillSet+'</span><br>';
					
				}
				
				if(job.yrsOfExperience != null){
				
					mailContent += 'Experience : ' + '<span  style="color: #1155CC;">' +job.yrsOfExperience+'</span>';
					
				}
				var http = "https://"+localStorage.getItem('careerSiteUrl');
				
				$rootScope.emailInivteContent = mailContent;

				mailContent += " </div>";
				mailContent += "<div style='display: inline-block;width: 100%; padding: 10px 35px;font-size: 17px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:10px 11% 0px 35px;font-size:16px;display: inline-block;' class='emailInivteContentDivPadding'>";
				
				mailContent += " <a id='viewapplybutton' class='viewapplybtn' style='color:#fff;text-decoration: none !important;display: inline-block;padding: 10px 12px;background:#5491ca;' target='_blank'";
				mailContent +=  " href=";
				mailContent +=  http +"/#!/job-view/"+job.jobUrl+"/?source=referralInvite&ref="+$rootScope.uuid+">";
				mailContent +=  "View and apply to this job opening</a></div>";
				mailContent += "<div class='emailInivteContentDivPadding' style='display: block;padding:10px 35px 0px ;vertical-align:text-top;margin-top:10px;'><p style='font-size:16px;vertical-align: 7.5px;display: inline;margin-right:10px;'>Share this job with your network</p><a style='padding: 0px 1px 0px 0px' custom-url="+"http://"+localStorage.getItem('careerSiteUrl')+"/#!/job-view/"+job.jobUrl+"/?source=facebookShare&ref="+$rootScope.uuid+" social-facebook><img src="+$scope.FbImg+" alt='Facebook' title='Facebook' style='height:25px;' /></a>";
				//mailContent +='<a style="padding: 0px 1px 0px 0px " status="{{job.jobTitle}} - http://{{"http://"+localStorage.getItem('careerSiteUrl')}}/#!/job-view/{{job.jobUrl}}/?source=twitter&referrer={{userName}}" social-twitter><img ng-src="{{TwtrImg}}" alt="Twitter" title="Twitter" style="height:25px;"/></a>';
				mailContent +="<a style='padding: 0px 1px 0px 0px'";
				mailContent +=	"status=";
				//mailContent += str+"-";
				mailContent += http + "/#!/job-view/" +job.jobUrl + "/?source=share-twitter&ref="+$rootScope.uuid;
				mailContent += " social-twitter><img src="+$scope.TwtrImg+" alt='Twitter' title='Twitter' style='height:25px;'/></a>";
				mailContent +=	"<a style='padding: 0px 1px 0px 0px'";
				mailContent +=	"custom-url=";
				mailContent +=	http + "/#!/job-view/" +job.jobUrl + "/?source=share-linkedin&ref="+$rootScope.uuid;
				mailContent += " social-linkedin><img src="+$scope.LinkedinImg+" alt='LinkedIn' title='LinkedIn' style='height:25px;' /></a>";
				mailContent +=	"<a style='padding: 0px 1px 0px 0px'";  
				mailContent +=	"custom-url="
				mailContent += http +"/#!/job-view/" +job.jobUrl+ "/?source=googleplus&ref="+$rootScope.uuid;
				mailContent += " social-gplus><img src="+$scope.GplusImg+" alt='Google+' title='Google+' style='height:25px;' /></a></div></div><div style='display: inline-block; width: 100%; padding:10px 35px 35px;font-size: 17px;'></div></div></div>";			
					
			    $rootScope.emailInivteContent = mailContent;
			    $rootScope.emailInivteContent= $sce.trustAsHtml($rootScope.emailInivteContent);
					
		   }
			
			$rootScope.emailErrInvitePopularize = false;
			  
			 $scope.sendInviteFriendsEmail = function(){
				 $activityIndicator.startAnimating();
				 $('#previewContent').css('border','none');
				 $('#previewContent').css('margin','0px');
				 $('#cursorBlinking').css('display','none');
				 $('#viewapplybutton').css('display','inline-block');
				 var errorFound = "no";
				 var fromMailErrorFound = "no";
				 var errorFoundForNoEmail = "no";
				 var errorFoundForNoFromEmail = "no";
				 var errorFoundForNoSubject = "no";
				 
				 var inviteCandidatesEmailIdList = [];
				 var index=0;
				 $rootScope.errEmailId = false;
				 $rootScope.errFromEmailAddress = false;
				 			
				 emailTags = $scope.inviteCandidateTags;
			
				 $scope.editedEmailContent= document.getElementById('emailContent').innerHTML;
				 $scope.emailSubject = $scope.emailInivteSubject;
				
				  if(emailTags == null || emailTags == '' ){
					  
					  $activityIndicator.stopAnimating();
					  $rootScope.emailErrInvitePopularize = true;
					  errorFoundForNoEmail = "yes";
						
				  } else {
					  
					  errorFoundForNoEmail = "no";
				  } 
				  
			 emailTags = JSON.stringify(emailTags);
			 var inviteCandidateTagsSplit = emailTags.split(',');
			
			  for(index=0; index < inviteCandidateTagsSplit.length;index++){
				  var strold = inviteCandidateTagsSplit[index];
				 
					var strnew = strold.substr(9, strold.length-11);
					
					strnew =  strnew.replace(/['"]+/g, '');
					
					  if ((strnew.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(strnew) && errorFound == "no"))  
					  { 
						  inviteCandidatesEmailIdList.push(strnew);
					   
					  } else {
						  $activityIndicator.stopAnimating();
						  errorFound = "yes";
						  $rootScope.errEmailId = true;
					 } 
			  }
			  
				var inviteEmail = inviteCandidatesEmailIdList;
				
				if(errorFound === "no" && errorFoundForNoEmail === "no" && fromMailErrorFound == "no" && errorFoundForNoFromEmail == "no" && errorFoundForNoSubject == "no" ){
				
			    var fromEmail = localStorage.getItem('referraluserName');
			    $scope.loggedAdminIdAdminId=0;
				$scope.referralsessionId=localStorage.getItem('referralsessionId');
				var jobId =  localStorage.getItem('JobId');
				$scope.referralloginUserId =  localStorage.getItem('referralloginUserId');
				
var referralloginUserId = localStorage.getItem('referralloginUserId');
				
				var userId = referralloginUserId;
				
			    var referralsessionId = localStorage.getItem('referralsessionId');

				services.sendInviteCandidatesEmail('E',inviteEmail, $rootScope.jobId, fromEmail, growl, $scope.editedEmailContent, $scope.emailSubject).then(function (response) {
					 
			    	$('#closeInviteFriendsPopup').click();
					$scope.cancelInvites();
					
					if (response.status == 200 && response.data.code == 200) {
						 $activityIndicator.stopAnimating();
						 growl.success(ClientEmpRefInviteCandidateSuccessMessage,{ttl:5000}); //new message
						 //growl.success("Invitation sent successfully"); old message
						
		            } else {
		            	growl.error(CommonFailureMessage,{ttl:5000}); //new message
		            	//growl.error("Something went wrong. Please try again."); old message
		            }
					
					});	
				 }
				
			 };
			 
			 
				var jobID  = null;
				var isEmployeeReferralEnabled=true;
				//widget share email function
				 $scope.sendEmail = function(job_id,is_Employee_Referral_Enabled) {
					 jobID = job_id;
					 isEmployeeReferralEnabled=is_Employee_Referral_Enabled;
					 localStorage.setItem('managePagePath','job-view');
					 // To get job
					 services.getJobCompanyUser(jobID).then(function(data){
							var job = data.data;
							 var url = $location.absUrl();
							if (isLocal) {
								
								$scope.companyLogo=  COMPANYURL +'manage/images/'+ job.companyLogo ;
							
							}else if(url.indexOf(job.careerSiteurl) > -1){
								
								$scope.companyLogo=  "http://"+job.careerSiteurl + "/manage/images/"+  job.companyLogo ;
								
								
							}else {
								
								$scope.companyLogo = COMPANYURL +'manage/images/'+ job.companyLogo;
							}
							
							
						$rootScope.popularizeShareJobEmailFrom = $scope.userName;	

					    $scope.popularizeShareJobEmailsubject =job.jobTitle + " at " + localStorage.getItem('companyName');
						
						var popularizeMailContent = '<div  class="emailInivteContentMainDiv" style=" font-family: sans-serif;font-size: 14px;margin-bottom: 0px;width:99%; display: inline-block;"><div><div style="padding-bottom: 10px;" class="emailInivteContentDivPadding">'
							+ '<div style="float: right;padding: 15px;padding-right: 50px; width:100%"><div></div>';
						if(job.companyLogo){
						
							popularizeMailContent += '<img style="max-height: 40px;float:right" ng-src="'+$scope.companyLogo+'"/><br>' ;
						
						}
						if(isEmployeeReferralEnabled== true ){
							popularizeMailContent += '<div style="word-wrap: break-word;padding: 27px 27px 7px 50px;" id="shareJobEmailContentEdit" >Hi,</div>'
								
								+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 12px; line-height: 200%; text-align: left; color: #414242;margin-top: 20px;padding-left: 50px;" class="emailInivteContentDivPadding">'
				
								+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
							}
						else{
							popularizeMailContent += '<div style="word-wrap: break-word;padding: 27px 27px 7px 50px;outline: none;" id="shareJobForIJPEmailContentEdit" >Hi,</div>'
								
								+ '<div  style="background-color: #F2F2F2; padding: 20px; text-align: center; font-size: 12px; line-height: 200%; text-align: left; color: #414242;margin-top: 20px;padding-left: 50px;" class="emailInivteContentDivPadding">'
				
								+ 'Job Title : ' + '<span  style="color: #1155CC;">' +job.jobTitle+'</span><br>';
							}
						
							 if(job.location != null && job.location != ""){
								
								 popularizeMailContent += 'Location : '+ '<span  style="color: #1155CC;">' +job.location+'</span><br>';
								
							}
							 
							if(job.skillSet != null && job.skillSet != ""){
								
								popularizeMailContent +='Mandatory Skills : '  + '<span  style="color: #1155CC;">' +job.skillSet+'</span><br>';
								
							}
							
							if(job.yrsOfExperience != null && job.yrsOfExperience != ""){
							
								popularizeMailContent += 'Experience : ' + '<span  style="color: #1155CC;">' +job.yrsOfExperience+'</span>';
								
							}
							var http = "http://"+localStorage.getItem('careerSiteUrl');
							
							
							
							if(isEmployeeReferralEnabled== true){
								var http = "http://"+job.careerSiteUrl;
							popularizeMailContent += "</div>";
							popularizeMailContent += "<div style='display: inline-block;width: 100%; padding:0px 50px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:0px 11% 0px 50px;font-size:14px;display: inline-block;margin-bottom:20px;' class='emailInivteContentDivPadding'>";
							popularizeMailContent += "You can view the details of the job and apply ";
							popularizeMailContent += "<a target='_blank' style='color:#2989CA;text-decoration:underline;'";
							popularizeMailContent +=  "href=";
							popularizeMailContent +=  http +"/#!/job-view/"+job.jobUrl+"/?source=EmployeeReferral&subSource=referralInvite&ref="+$rootScope.uuid+">";
							popularizeMailContent +=  "here</a></div>";
							popularizeMailContent +=  "<div class='shareJobEmailSeperator'></div>";
							 $scope.popularizeShareJobEmailContent = popularizeMailContent;
							}else{
								var http = "http://"+job.careerSiteUrl+"/referral";
								popularizeMailContent += "</div>";
								popularizeMailContent += "<div style='display: inline-block;width: 100%; padding:0px 50px;'></div><div style='display: inline-block;width: 100%;'><div  style='padding:0px 11% 0px 50px;font-size:14px;display: inline-block;margin-bottom:20px;' class='emailInivteContentDivPadding'>";
								popularizeMailContent += "You can view the details of the job and apply ";
								popularizeMailContent += "<a target='_blank' style='color:#2989CA;text-decoration:underline;'";
								popularizeMailContent +=  "href=";
								popularizeMailContent +=  http +"/#/viewjob/"+jobID+">";
								popularizeMailContent +=  "here</a></div>";
								popularizeMailContent +=  "<div class='shareJobEmailSeperator'></div>";
								 $scope.popularizeShareJobForIJPEmailContent = popularizeMailContent;
							}
					
						   
						   
					 
						});
				 
				 };
			 
				 $scope.shareJobEmailContentEdit = function() {
			    	  document.getElementById("shareJobEmailContentEdit").contentEditable = true;
			    	  document.getElementById("shareJobEmailContentEdit").focus();
			      }
			      $scope.shareJobForIJPEmailContentEdit = function() {
			    	  document.getElementById("shareJobForIJPEmailContentEdit").contentEditable = true;
					  document.getElementById("shareJobForIJPEmailContentEdit").focus();
			      }
			 
			      $scope.emailErrInvitePopularize = false;
			      $scope.sendInviteCandidatesEmail = function(status){
			 		 var errorFound = "no";
			 		 var fromMailErrorFound = "no";
			 		 var errorFoundForNoEmail = "no";
			 		 var errorFoundForNoFromEmail = "no";
			 		 var errorFoundForNoSubject = "no";
			 		 var emailTags = null;
			 		 var inviteCandidatesEmailIdList = [];
			 		 var index=0;
			 		 $rootScope.errEmailId = false;
			 		 $rootScope.errFromEmailAddress = false;
			 		 $scope.emailFrom = $scope.popularizeShareJobEmailFrom;
			 		 
			 		 if(status == 'C'){
			 			 
			 			 emailTags = $rootScope.emailInivteContent;
			 			 $scope.editedEmailContent= document.getElementById('emailContent').innerHTML ;
			 			 $scope.emailSubject = $scope.emailInivteSubject;
			 			 
			 		 } else if(status == 'E') {
			 		 
			 		     emailTags = $scope.jobsPopularizeTags;
			 		     
			 		     if(isEmployeeReferralEnabled == true){
			 		    	 $scope.editedEmailContent= document.getElementById('shareJobEmailContent').innerHTML ;
			 		     }
			 		     else{
			 		    	 $scope.editedEmailContent= document.getElementById('shareJobForIJPEmailContent').innerHTML ;
			 		     }
			 		     $scope.emailSubject = $scope.popularizeShareJobEmailsubject;
			 		     
			 		     $scope.emailFrom = $scope.popularizeShareJobEmailFrom;
			 		     
			 		     
			 		 } else {
			 			 emailTags = $scope.jobsPopularizeTags;
			 			 $scope.editedEmailContent= document.getElementById('popularizeEmailContent').innerHTML ;
			 			 $scope.emailSubject = $scope.popularizeEmailInivteSubject;
			 			
			 		 }
			 		 
			 		 $rootScope.jobId=localStorage.getItem('JobId');
			 		  if(emailTags == null || emailTags == '' ){
			 				 
			 				$rootScope.emailErrInvitePopularize = true;
			 				errorFoundForNoEmail = "yes";
			 				
			 		  } else {
			 			  
			 			  errorFoundForNoEmail = "no";
			 		  } 
			 		 
			 	  
			 	// email validation for tags
			 		  
			 	 emailTags = JSON.stringify(emailTags);
			 	 var inviteCandidateTagsSplit = emailTags.split(',');
			 	
			 	  for(index=0; index < inviteCandidateTagsSplit.length;index++){
			 		  var strold = inviteCandidateTagsSplit[index];
			 		  
			 			var strnew = strold.substr(9, strold.length-11);
			 			
			 			strnew =  strnew.replace(/['"]+/g, '');
			 			
			 			  if ((strnew.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(strnew) && errorFound == "no"))  
			 			  { 
			 				  inviteCandidatesEmailIdList.push(strnew);
			 			   
			 			 } else {
			 				errorFound = "yes";
			 				$rootScope.errEmailId = true;
			 				
			 			 } 
			 			  
			 	  }
			 	  
			 	  if(status == 'E') {
			 		  
			 		  if($scope.emailFrom == null || $scope.emailFrom == '' ){
			 			    $rootScope.errFromEmailAddress = false;
			 				$rootScope.fromEmailErr = true;
			 				errorFoundForNoFromEmail = "yes";
			 				
			 		  } else {
			 			  
			 			  errorFoundForNoFromEmail = "no";
			 		  } 
			 		  
			 		  if($scope.emailSubject == "") {
			 		      $rootScope.errFromEmailSubject = true;
			 		      errorFoundForNoSubject = "yes";
			 		  } else {
			 			  
			 			  errorFoundForNoSubject = "no";
			 		  }
			 		    
			 		   // email validation for from email address
			 		    var emailId = $scope.emailFrom; 
			 		  
			 		    if ((emailId.length == 0) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(emailId) && fromMailErrorFound == "no"))  
			 		    { 
			 		    	$rootScope.errFromEmailAddress = false;
			 		    } else {
			 		    	fromMailErrorFound = "yes";
			 		    	$rootScope.fromEmailErr = false;
			 		    	$rootScope.errFromEmailAddress = true;
			 		    	
			 		    }
			 	  }
			 	  
			 		var inviteEmail = inviteCandidatesEmailIdList;
			 		 
			 		if(errorFound == "no" && errorFoundForNoEmail == "no" && fromMailErrorFound == "no" && errorFoundForNoFromEmail == "no" && errorFoundForNoSubject == "no" ){
			 			 $activityIndicator.startAnimating();
			 			 
			 			 var fromEmail = "";
			 			 
			 			 if(status == 'E') {
			 				 fromEmail = $scope.emailFrom;
			 			 }else{
			 				 fromEmail = userName;
			 			 }
			 			 
			 			 $scope.loggedAdminIdAdminId=localStorage.getItem('loggedAdminIdAdminId');
			 	   		  if($scope.loggedAdminIdAdminId==null || $scope.loggedAdminIdAdminId=='undefined'){
			 	   				$scope.loggedAdminIdAdminId=0;
			 	   			}
			 				 $scope.sessionId=localStorage.getItem('sessionId');
			 		         $scope.loginUserId=localStorage.getItem('loginUserId');
			 		 services.sendInviteCandidatesEmail(status,inviteEmail, $scope.jobId, fromEmail, growl, $scope.editedEmailContent, $scope.emailSubject).then(function (response) {
			 			 $activityIndicator.stopAnimating();
			 	    	 $('#closeInviteCandidatePopup').click();
			 			 $('#closePopularizePopup').click();
			 			 $('#closeShareJobEmailPopup').click();
			 			 $('#closeShareJobForIJPEmailPopup').click();			 
			 			 $scope.cancelInvites();
			 			 
			 			 if (response.data.webserviceAPIResponseCode == UNAUTHORIZED){
			 				 growl.error(UNAUTHORIZED_ERROR_MSG,{ttl:5000});
			 				 $('#logout').click();
			 				 return;
			 			 }
			 			 
			 			 if (response.status == 200 && response.data.code == 200 && status == 'C') {
			 				 $activityIndicator.stopAnimating();
			 				 growl.success(ClientEmpRefInviteCandidateSuccessMessage,{ttl:5000}); //new message
			 				 //growl.success("Invitation sent successfully"); old message
			 				
			             }else if (response.status == 200 && response.data.code == 200 && status == 'P') {
			             	 $activityIndicator.stopAnimating();
			             	 growl.success(ClientEmpRefRequestToPopularizeSuccessMessage,{ttl:5000}); // new message
			 				 //growl.success("Request to popularize has been sent successfully"); old message
			 				
			             }else if (response.status == 200 && response.data.code == 200 && status == 'E') {
			            	     $activityIndicator.stopAnimating();
			            	     growl.success(ClientEmpRefEmailInviteSuccessMessage,{ttl:5000}); //new message
			 				 //growl.success("Email sent successfully"); old message
			 				 
			             } else {
			             	 growl.error(CommonFailureMessage,{ttl:5000}); //new message
			 				 //growl.error("Something went wrong. Please try again."); old message
			 				 
			 			 }
			             return;
			 			
			 			});	
			 		 }
			 		
			 	 };
			
			 $("#closeInviteFriendsPopup").click(function(){
			 	$(".tag-item").css("display","none");
			 	
			 });
			 
			 $scope.cancelInvites = function(){
			   $rootScope.emailInivteContent = null;	  
			   $rootScope.inviteCandidateTags = null;
			   $rootScope.emailErrInvitePopularize=false;
			   $rootScope.errEmailId =  false;
			   $rootScope.fromEmailErr = false;
			   $rootScope.errFromEmailAddress = false;
			   $rootScope.errFromEmailSubject = false;
			   $rootScope.popularizeShareJobEmailFrom = null;
			 //  $scope.emailInivteSubject = null;
			   $('#subjectEditContent').prop('disabled', true);
			   $('#previewContent').css('border','none');
			   $('#previewContent').css('margin','0px');
			   $('#cursorBlinking').css('display','none');
			
		     };
		     
		     // resume parser
		        $scope.resumeParser = function(){
		   			 
		   			var file = fileUpload.files[0];
		   			var fileName= file.name;
		   			$activityIndicator.startAnimating();
		   			services.resumeParser(file,fileName)
		    		.then(function(data) {
		    			
		    			$activityIndicator.stopAnimating();
		    			if(data.data != null){ 
		    				var jobApplication = data.data;
		    				$scope.JobApplication.firstName = null;
							$scope.JobApplication.emailId = null;
							$scope.JobApplication.phoneNo = null;
							$scope.JobApplication.firstName = jobApplication.firstName;
							$scope.JobApplication.emailId = jobApplication.emailId;
							$scope.JobApplication.phoneNo = jobApplication.phoneNo;
		    			} 
		    		
		    		});
		   		 }
		

	// Language related chage for subscriptionDetails

	$scope.getLanguage = function () {

		// value not selected 
		if ((localStorage.getItem('selectedLanguage') == null) || (localStorage.getItem('selectedLanguage') == "null") || (localStorage.getItem('selectedLanguage') == "undefined")) {
			$scope.selectedLanguage = "LN_EN_UK";
		} else {
			// get from the cache
			$scope.selectedLanguage = localStorage.getItem('selectedLanguage');
		}

		localStorage.removeItem('selectedLanguage');
		localStorage.setItem('selectedLanguage', $scope.selectedLanguage);
		$rootScope.$emit("selectedLanguage", $scope.selectedLanguage);
	};
	$scope.getLanguage();

	$scope.jobListView;
	$rootScope.$on("selectedLanguage", function (event, selectedLanguage) {
		$scope.loadLanguageMetadata(selectedLanguage);
	});


	$scope.loadLanguageMetadata = function (selectedLanguage) {
	
		var languageSeleted = localStorage.getItem('selectedLanguage');
		if(languageSeleted != undefined && languageSeleted === selectedLanguage && localStorage.getItem('languageJson') != undefined){
	  			var languageJson = JSON.parse(localStorage.getItem('languageJson'));
	  			 $scope.jobListView = languageJson["jobListEs-common"];
				 $rootScope.addProfileView = languageJson["add-Profile"];
	  		} else{
	  			localStorage.setItem('selectedLanguage', selectedLanguage);
		  		internationalizationService.loadLanguageMetadata(selectedLanguage).then(function (data) {
		  	  
					  localStorage.setItem('languageJson', JSON.stringify(data));
					  $scope.jobListView = data["jobListEs-common"];
						$rootScope.addProfileView = data["add-Profile"];
				  });
			}
		console.log($scope.data);
	};
	  
});


ccubeApp.controller("MenuCtrl", function($scope, $rootScope, $location) {
	
	var path = "/job-list";
	
	$rootScope.getClass = function(path) {
	    if ($location.path().substr(0, path.length) == path) {
	      return "active"
	    } else {
	      return ""
	    }
	};
	
	$scope.go = function() {
		
		$rootScope.myClass = "";
	
	$rootScope.getClass = function(path) {
	    if ($location.path().substr(0, path.length) == path) {
	    	$rootScope.myClass = "active";
	      return "active"
	    } else {
	      return ""
	      $rootScope.myClass = "";
	    }
	 };
   };
	
});

ccubeApp.controller("cpInterCtrl", function($scope, $rootScope, $location, services, localStorageService,xdLocalStorage, $routeParams) {
	
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

	 $rootScope.employeeId = Base64.decode($routeParams.employeeId);
	
	 $rootScope.employeeEmailId = Base64.decode($routeParams.employeeEmailId);
	 
	 $rootScope.employeeUserName = Base64.decode($routeParams.employeeUserName);
	 
	
	 $scope.enableIjp=localStorage.getItem('enableIjp');
	 $scope.HomeEnabled = localStorage.getItem('eRHomePage');
	 localStorage.setItem('referraluserName', $rootScope.employeeUserName);
	 
	 $scope.referalName = localStorage.getItem('referraluserName');
	 
	 $scope.formRedeem={};
	 $scope.referralloginUserId=localStorage.getItem('referralloginUserId');
	 $scope.referralloginUserName = localStorage.getItem('referraluserName');
	services.getAllPointsDetailsForEmployee($scope.referralloginUserId, $scope.referralloginUserName).then(function(data){
    	 $scope.formRedeem.pointsAvailed=data.data.result.pointsAvailed;
    	 $scope.formRedeem.totalPoints=data.data.result.totalPoints;
    	 $scope.formRedeem.pointsPending=data.data.result.pointsPending;
    	 $scope.formRedeem.currentPoint=data.data.result.currentPointBalance;
    	 $scope.currentPoint=data.data.result.currentPointBalance;
    	
     });
	
	 
	 services.getEmployeeLoggedInDetails($rootScope.employeeId,$rootScope.employeeEmailId).then(function(data) {
		 
	
           if(data.data == "false" || data.data==false){
		 $location.path('/changePassword');
		 
	   } else {
		 
		 $location.path('/login');
		
	   }
		 
		 
	});
	
});

ccubeApp.controller("cpCtrl", function($scope, $rootScope, $location, services, localStorageService,xdLocalStorage, $routeParams,growl) {
	
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

	$scope.referalName = localStorage.getItem('referraluserName');
	if($scope.referalName === null){
    	sessionStorage.setItem('managePagePath', "Change-Password");
	   	$location.path('/');
		return;
	}
var siteUrl = "";
	services.getCompanyLogo().then(function(data) {
		$scope.configurationExternalSystem = data.data;
		
		if($scope.configurationExternalSystem.companyLogoName == "" || $scope.configurationExternalSystem.companyLogoName == null || $scope.configurationExternalSystem.companyLogoName == 'null'){
		
			$scope.companyName = $scope.configurationExternalSystem.companyName;
			
		}else{
		 
		if($scope.configurationExternalSystem.companyFolderPath == ""){
		
	        	
	        	$scope.imageSrcCompanyLogos = "images/"+$scope.configurationExternalSystem.companyLogoName;
	        
	        } else {
	        	
	        	if(isLocal) {
	        		
	        		siteUrl = COMPANYURL;
	        		
	        		$scope.imageSrcCompanyLogos = "/images/"+$scope.configurationExternalSystem.companyLogoName;
	        	} else {
	        	
	        		$scope.imageSrcCompanyLogos = "/images/"+$scope.configurationExternalSystem.companyLogoName;
	        	}
	        	

	        }
		}
		
		 localStorage.setItem('companyLogo', $scope.imageSrcCompanyLogos);	
		 localStorage.setItem('careerSiteLogo', $scope.configurationExternalSystem.companyLogoName);	
		 $scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
		 localStorage.setItem('companyName', $scope.companyName);
		
		
	});


$scope.submitchangePasswordForm = function($valid) {
		
		if(!$valid){
			return ;
		}
			
		var companyEmployee = {
		    	"id" : $rootScope.employeeId,
		    	"email" : $rootScope.employeeEmailId,
		    	"password" : Base64.encode($scope.confirmPassword)
		    }
		
		services.changeEmployeePassword(companyEmployee).then(function(ResponseObject){
			
			$rootScope.sessionTimeOut = false;
	        $scope.loginstatus = ResponseObject.data9;
	        $scope.sessionId=ResponseObject.data.data1;
	        if((ResponseObject.data.data1=='Null' || ResponseObject.data.data1=='') && ResponseObject.data.data9 ==false)
	        	{
	        	 	$scope.failuremsg = "Sorry!.Your access to employee referral portal has been rejected.";
	        	}
	        else
	        	{
	        if($scope.loginstatus == 'false' || $scope.loginstatus == false ){
	        	$scope.failuremsg = " Sorry! Looks like you typed it wrong. Please try again.";
	        }else{
	        	if($scope.sessionId!=null && $scope.sessionId!="null" && $scope.sessionId!=undefined){
					services.loggedInUser($rootScope.employeeEmailId,$scope.sessionId).then(function(data){

						$scope.loggedInUser = data.data;
				
						xdLocalStorage.setItem('referralsessionId', $scope.sessionId, function (data) { /* callback */ });
						localStorage.setItem('referralsessionId', $scope.sessionId);
						
						
						
						localStorage.setItem('referralloginUserId', $scope.loggedInUser.id);
						localStorage.setItem('referraluserName', $scope.loggedInUser.email);
						localStorage.setItem('referralwelUserName', $scope.loggedInUser.employeeName);
						localStorage.setItem('points', $scope.loggedInUser.pointBalance);	
						localStorage.setItem('referrallencodedEmailId', $scope.loggedInUser.encodedEmailId);
						$rootScope.userName = $rootScope.employeeEmailId;
						$rootScope.userNameDisplay = $scope.loggedInUser.employeeName;
						localStorage.setItem('referrallisUserExist','yes');
					
						$location.path('/job-list');
						
						delete $rootScope.employeeId
						delete $rootScope.employeeEmailId
						
					},function error(response) {
						$location.path('/logout');
					});
				}
	        	
	        	
	        } 
	    
	        	}

		});
		
		
		
	}

$scope.submitchangePasswordFormWithSessionId = function($valid) {
	
	if(!$valid){
		return ;
	}
		
	var changePassword = {
	       	"emailId" : $scope.referalName,
	    	"confirmpassword" : window.btoa($scope.changePassword.confirmpassword),
	    	"newpassword" : window.btoa($scope.changePassword.newpassword),
	    	"confirmnewpassword" : window.btoa($scope.changePassword.confirmnewpassword)
	    	 
	    }
		if(changePassword!=null && changePassword!="null" && changePassword!=undefined){
	services.changeEmployeePasswordWithSessionId(changePassword)
		.then(function(data){
			if(data.data.responseCode === 200){
				$location.path('/logout');
				growl.success(data.data.reponseObject,{ttl:5000});
			}
			else {
				growl.error(data.data.reponseObject,{ttl:5000});
			}
	},function error(response) {  
		growl.error(response.data.message,{ttl:5000});
	})}
}
	// disable action btn if users enters < > char
$scope.checkIfValid = function (){
	if(!$scope.changePassword.confirmpassword || !$scope.changePassword.newpassword || !$scope.changePassword.confirmnewpassword) return false;
	return !($scope.changePassword.confirmpassword.includes('>') || $scope.changePassword.confirmpassword.includes('<') || $scope.changePassword.newpassword.includes('>') || $scope.changePassword.newpassword.includes('<') || $scope.changePassword.confirmnewpassword.includes('>') || $scope.changePassword.confirmnewpassword.includes('<'));
}

});

ccubeApp.controller('companyPolicyController', function($scope,Pagination,localStorageService,$activityIndicator,services,xdLocalStorage,growl,$rootScope,$location) {
	
	$scope.toggleLaeder = "no";
    $scope.togglemyReferral = "no";
	$scope.togglehome = "no";
	$scope.toggleijp = "no";
    $scope.toggleBenefits = "no";
	$scope.togglemyRedeemPoints= "no";
	$scope.toggleCompanyPolicy = "yes";
	$scope.togglemyApplies = "no";
	$scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
	$scope.companyName = localStorage.getItem('companyName');
	
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	if($scope.welUserName === null){
		localStorage.setItem('managePagePath', "companyPolicy");
	   	$location.path('/');
		return;
	}
	$scope.type = 'P';
	services.getCompanyPolicy($scope.type).then(function(data){
		$scope.companyPolicyList = data.data;
	});
	
});

ccubeApp.controller('myAppliesCtrl', function($scope,Pagination,localStorageService,$activityIndicator,services,xdLocalStorage,growl,$rootScope,$location) {
	
	$scope.toggleLaeder = "no";
    $scope.togglemyReferral = "no";
	$scope.togglehome = "no";
	$scope.toggleijp = "no";
    $scope.toggleBenefits = "no";
	$scope.togglemyRedeemPoints= "no";
	$scope.toggleCompanyPolicy = "no";
	$scope.togglemyApplies = "yes";
	$scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	$scope.companyName = localStorage.getItem('companyName');	
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
});

angular.module('ngToggle', [])
    .controller('AppCtrl',['$scope', function($scope){
        $scope.custom = true;
        $scope.toggleCustom = function() {
            $scope.custom = $scope.custom === false ? true: false;
        };
}]);

ccubeApp.controller('customMenuCtrl', function($scope,Pagination,localStorageService,$activityIndicator,services,xdLocalStorage,growl,$rootScope,$location) {
	
	$scope.toggleLaeder = "no";
    $scope.togglemyReferral = "no";
	$scope.togglehome = "no";
	$scope.toggleijp = "no";
    $scope.toggleBenefits = "no";
	$scope.togglemyRedeemPoints= "no";
	$scope.toggleCompanyPolicy = "no";
	$scope.togglemyApplies = "no";
	$scope.toggleCustomMenu1 = "no";
	$scope.toggleCustomMenu2 = "no";
	$scope.toggleCustomMenu3 = "no";
	$scope.imageSrcCompanyLogo = localStorage.getItem('companyLogo');
	$scope.companyName = localStorage.getItem('companyName');	
	$scope.welUserName = localStorage.getItem('referralwelUserName');
	$scope.enableIjp=localStorage.getItem('enableIjp');
	$rootScope.isAdminEmployee=localStorage.getItem('isAdminEmployee');
	$scope.HomeEnabled = localStorage.getItem('eRHomePage');
	if($location.absUrl().indexOf('customMenu1') != -1 ){
		$scope.toggleCustomMenu1 = "yes";
		 for(i=0 ; i < $rootScope.customMenuList.length ; i++){
			 if($rootScope.customMenuList[i].entityType == 'customMenu1'){
				 $scope.customBanner = "../images/"+$rootScope.customMenuList[i].fileName;
				 $scope.htmlContent = $rootScope.customMenuList[i].notes;
			 }
		}
	}else if($location.absUrl().indexOf('customMenu2') != -1 ){
		$scope.toggleCustomMenu2 = "yes";
		 for(i=0 ; i < $rootScope.customMenuList.length ; i++){
			 if($rootScope.customMenuList[i].entityType == 'customMenu2'){
				 $scope.customBanner = "../images/"+$rootScope.customMenuList[i].fileName;
				 $scope.htmlContent = $rootScope.customMenuList[i].notes;
			 }
		}
		
	}else if($location.absUrl().indexOf('customMenu3') != -1 ){
		$scope.toggleCustomMenu3 = "yes";
		 for(i=0 ; i < $rootScope.customMenuList.length ; i++){
			 if($rootScope.customMenuList[i].entityType == 'customMenu3'){
				 $scope.customBanner = "../images/"+$rootScope.customMenuList[i].fileName;
				 $scope.htmlContent = $rootScope.customMenuList[i].notes;
			 }
		}
		
	}
});


