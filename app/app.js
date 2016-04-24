(function () {
    'use strict';

    angular.module('app',['ui.router','ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url:'/home',
            templateUrl: 'home.html',
            controller: 'homeController'
        })
        .state('adminPanel', {
            url:'/adminPanel',
            templateUrl: 'adminPanel.html',
            controller: 'adminController'
        });
    })
    .controller('mainController', function($scope,$state, $location){
        $scope.loginUserMain = true;
        $scope.registerUserMain = false;
        if($location.$$path==='/home'){
            $scope.loginUserMain = false;
            $scope.registerUserMain = false;
        }

        $scope.$on('gotoHome', function(){
            $scope.loginUserMain = false;
            $scope.registerUserMain = false;
            $state.go("home");                        
        });

        $scope.$on('gotoRegistrationPage', function(){
            $scope.loginUserMain = false;
            $scope.registerUserMain = true;
        });
        $scope.$on('gotoLoginPage', function(){
            $scope.loginUserMain = true;
            $scope.registerUserMain = false;
        });
    })
    .controller('adminController', function($scope, adminService){
        $scope.item={};
        $scope.saveItem = function(){
            adminService.saveItem($scope.item)
            .then(function(res){
                alert("item has been created you can create more item");
                $scope.reset();
            }, function(err){
                alert("there is some problem in saving data please do it again");
                $scope.reset();
            });
        };
        $scope.reset = function(){
            $scope.item={};
        };
    })
    .service('adminService', function($http){
        var self = this;
        self.saveItem =  function(item){
            $http.post('/api/items', item)
                .then(function(response){
                    return res;
                }, function(err){
                    console.log("error in creating item, please do it again");
                });
        };
    })
    .controller('homeController', function($scope, userService){
                  
        console.log( userService.helloWorld());
        $scope.toggle = true;
        $scope.toggleMenu = function(){
            $scope.arrow = !$scope.arrow;
            $scope.toggle = !$scope.toggle;
        };        
    })
    .controller('registerController',function($scope, userService,$state) {
        $scope.helloWorld = userService.helloWorld();
        //var testCtrl1ViewModel = $scope.$new();
        //$controller('homeController',{$scope : testCtrl1ViewModel });
        //testCtrl1ViewModel.myMethod();    
        
        $scope.showRegisterUser = function(){
            $scope.$emit("gotoRegistrationPage");
        }; 

        $scope.showLoginUser = function(){
            $scope.$emit("gotoLoginPage");
        };
      
        $scope.saveUser = function() {
        userService.Update($scope.user)
            .then(function(res){
                console.log('User saved');
                $scope.$emit("gotoLoginPage");
            }, function(err){
                console.log('there is some problem in creating user');
                $scope.$emit("gotoRegistrationPage");
            })
        };

        $scope.loginMethod = function(){
            console.log("loginMethod is calling..");
            userService.login({username:$scope.username, password:$scope.password})
            .then(function(res){
                if(res){
                    console.log("data is carried." + res); 
                    $scope.$emit("gotoHome");
                }else{
                    $scope.$emit("gotoRegistrationPage");
                }                
            }, function(err){
                console.log("error" + err);
                alert('there is some error in login');
            });
        };
        function initController() {
            // get current user
            console.log('init controller');            
            $scope.user = {};
            $scope.username = "";
            $scope.password = "";
        }
        initController();
    })
    .factory('userService', function($http, $q) {
        var service = {};
        service.helloWorld = function () {
            return 'Hello World!';
        };
        service.Update = Create;
        service.login = loginFunctionality;
        return service;

        function loginFunctionality(userLogin){
            return $http.post('/api/users/login', userLogin)
            .then(function(res){
                console.log("i am at login client");
                if((res!==undefined || res !== null || res!== '') && (userLogin.username==res.data.username)){
                    return res.data;
                }else{
                    alert('you are not signed up with us. please register with us');
                    return undefined;
                }
            }, function(err){
                if(err.status==401){
                    alert('you are not signed up with us. please register with us');
                    return undefined;
                }
                else{
                    console.log("i m in client with error");
                    return err;
                }
            });
        }

        function Create(user) {
            return $http.post('/api/users', user)
                    .then(function(res){
                        if(res.status==200){
                            alert('user is created with us, you can login now');
                            return res;    
                        }
                    }, function(err){
                        alert('data is not saved, there is some problem. Please do it again!!');
                        return err;
                    });
        }

        // private functions
        function handleSuccess(res) {
            console.log("I am back at client side");
            return res.data;
        }
        function handleError(err) {
            console.log("i m in client with error");
            return err;
        }
    });

    //angular.bootstrap(document, ['app']);    
})();
