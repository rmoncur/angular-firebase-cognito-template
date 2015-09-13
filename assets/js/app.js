/*
* Author: Rob Moncur
* Description: Use this template to get started with Google Plus Login and Cognito
* Date: 8/22/2015
*/

//Firebase and cognito references
firebaseid = "https://recipeauth.firebaseio.com";
cognitoidentitypoolid = "us-east-1:df3f5332-7677-46ee-b49f-927c840a38d2";


//Initializing the angular app
var app = angular.module('myApp', ['ngRoute','ui.bootstrap']);

//Main controller for the application
app.controller("rootCtrl",["$scope","$http","$location",function ($scope, $http, $location) {
	
	//Rendering the google login button
	$scope.renderGoogleLogin = function(){
		
		$scope.loggedIn = false;
		
		//Rendering the google plus login button
		gapi.signin2.render('my-signin2', {
			'scope': 'https://www.googleapis.com/auth/plus.login',
			'width': 230,
			'height': 40,
			'longtitle': true,
			'theme': 'dark',
			'onsuccess':$scope.login,
			'onfailure': function(error){ console.log("Google Auth Error",error); }
		});
	}
	
	//onsuccess function for a google login
	$scope.login = function(googleUser){
		
		//Logging
		console.log('Google logged in as: ' + googleUser.getBasicProfile().getName())
		console.log("id_token",googleUser.getAuthResponse().id_token);			
	
		//Setting the Cognito parameters
		AWS.config.region = 'us-east-1';
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: cognitoidentitypoolid ,
			Logins: {
				'accounts.google.com': googleUser.getAuthResponse().id_token
			},
		});
		
		AWS.config.credentials.get(function(){
			console.log("Cognito Credentials Gotten");	
		});
		
		//Authenticating with firebase
		if( $scope.firebase == null){
			$scope.firebase = new Firebase(firebaseid);
		}
		var access_token = googleUser.getAuthResponse().access_token
		
		if( $scope.firebase.getAuth() == null ){
			$scope.firebase.authWithOAuthToken("google",access_token,function(error,authData) {
				if(error){
					console.log("Firebase auth failed:", error);
				} else {
					console.log("Firebase auth succeeded:", authData);
				}
			});
			
		} else {
			console.log("Already logged into firebase",$scope.firebase.getAuth());
		}
		
		//Setting loggedIn to be true		
		$scope.$apply(function(){
			$location.path("/");//.replace();
			$scope.loggedIn = true;
		});
		
	}
	
	// Logging you out of Google
	$scope.logout = function(){
		$scope.firebase.unauth();
		gapi.auth2.getAuthInstance().signOut().then($scope.navigateLogout());
	}
	
	//Navigating you to the logout page
	$scope.navigateLogout = function(){
		$location.path("/").replace();
		$scope.loggedIn = false;
	}
	
}]);


// Configuring Routes
app.config(function($routeProvider,$locationProvider) {
	$routeProvider

		// route to home
		.when('/', {
			templateUrl : 'pages/home.html',
			//controller  : 'rootCtrl'
		})
		
		//route to page 1
		.when('/page1', {
			templateUrl : 'pages/page1.html',
			//controller  : 'rootCtrl'
		})

		//route to page 2
		.when('/page2', {
			templateUrl : 'pages/page2.html'
			//controller  : 'rootCtrl'
		})
		
		// route to page 3
		.when('/page3', {
			templateUrl : 'pages/page3.html'
			//controller  : 'rootCtrl'
		})
		.otherwise( { redirectTo: "/" });
		;
	
	$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');	
	
}).run(function($rootScope, $location) {
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
    	if (event.currentScope.loggedIn == false) {
			$location.path("/");
    	}
	});
});

