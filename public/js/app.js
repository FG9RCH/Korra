/**
 * Created by Frank on 3/10/2016.
 */
    var korra = angular.module('Korra', ['ngMaterial', 'ui.router',  'ngFileUpload', 'ngMdIcons', 'angularCSS'])

    //---------------
    // Routes
    //---------------
    .run(function($rootScope, $http){
        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function(){
            $rootScope.message = 'Logged out.';
            $http.post('/logout');
        };
    })
    .config(['$mdThemingProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function($mdThemingProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

        var customPrimary = {
            '50': '#e0eaf6',
            '100': '#ccdcf1',
            '200': '#b9cfeb',
            '300': '#a5c1e5',
            '400': '#91b4e0',
            '500': '#7da6da',
            '600': '#6998d4',
            '700': '#558bcf',
            '800': '#417dc9',
            '900': '#3571bc',
            'A100': '#f4f8fc',
            'A200': '#ffffff',
            'A400': '#ffffff',
            'A700': '#3065a8'
        };
        $mdThemingProvider
            .definePalette('customPrimary',
                customPrimary);

        var customAccent = {
            '50': '#000000',
            '100': '#010102',
            '200': '#080b14',
            '300': '#0e1527',
            '400': '#15203a',
            '500': '#1c2a4c',
            '600': '#2a3e72',
            '700': '#314884',
            '800': '#385397',
            '900': '#3e5daa',
            'A100': '#2a3e72',
            'A200': '#23345f',
            'A400': '#1c2a4c',
            'A700': '#4668bb'
        };
        $mdThemingProvider
            .definePalette('customAccent',
                customAccent);

        var customWarn = {
            '50': '#ffb280',
            '100': '#ffa266',
            '200': '#ff934d',
            '300': '#ff8333',
            '400': '#ff741a',
            '500': '#ff6400',
            '600': '#e65a00',
            '700': '#cc5000',
            '800': '#b34600',
            '900': '#993c00',
            'A100': '#ffc199',
            'A200': '#ffd1b3',
            'A400': '#ffe0cc',
            'A700': '#803200'
        };
        $mdThemingProvider
            .definePalette('customWarn',
                customWarn);

        var customBackground = {
            '50': '#ffffff',
            '100': '#ffffff',
            '200': '#ffffff',
            '300': '#ffffff',
            '400': '#f9f9f9',
            '500': '#ececec',
            '600': '#dfdfdf',
            '700': '#d2d2d2',
            '800': '#c6c6c6',
            '900': '#b9b9b9',
            'A100': '#ffffff',
            'A200': '#ffffff',
            'A400': '#ffffff',
            'A700': '#acacac'
        };
        $mdThemingProvider
            .definePalette('customBackground',
                customBackground);

        $mdThemingProvider.theme('default')
            .primaryPalette('customPrimary')
            .accentPalette('customAccent')
            .warnPalette('customWarn')
            .backgroundPalette('customBackground');

        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user){
                // Authenticated
                if (user !== '0')
                /*$timeout(deferred.resolve, 0);*/
                    deferred.resolve();

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);

                    $location.url('/login');
                    deferred.reject();
                }
            });

            return deferred.promise;
        };
        //================================================
        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function($q, $location) {
            return {
                response: function(response) {
                    // do something on success
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            };
        });


        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: '/templates/admin/admin.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })


            .state('admin.settings', {
                url: '/settings',
                templateUrl: '/templates/admin/settings/settings.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.themes', {
                url: '/themes',
                templateUrl: '/templates/admin/settings/theme.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('public', {
                url: '/public',
                templateUrl: '/templates/public/admin/admin.html',
                css: '/templates/public/admin/CrowdFundMe.css',
                resolve: {
                    loggedin: checkLoggedin
                }

            })
            .state('login', {
                url: '/login',
                templateUrl: '/templates/public/login/login.html',
                css: [ '/templates/public/login/reset.css', '/templates/public/login/login.css'],
                controller: 'LoginCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '/templates/public/profile/profile.html',
                css: '/templates/public/profile/profile.css',
                controller: 'ProfileCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
        })
            .state('profile-setup', {
                url: '/profile-setup',
                templateUrl: '/templates/public/profile/profile-setup.html',
                css: '/templates/public/profile/profile.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('/signup', {
                url: '/signup',
                templateUrl: '/templates/public/signup/signup.html',
                css: '/templates/public/signup/signup.css',
                controller: 'LoginCtrl'
        })

            .state('landing', {
                url: '/landing',
                templateUrl: '/templates/public/landing/landing.html',
                css: '/templates/public/landing/landing.css',
            });

        $urlRouterProvider.otherwise('/login');

       
    }])

    //---------------
    // Services
    //---------------

    .factory('Theme', ['$http', function($http){
        return {
            get: function(){
                return $http.get('/api/themes');
            },
            getActive : function(theme) {
                return $http.get('/api/themes/' + theme)
            },
            delete : function(id) {
                return $http.delete('/api/users/' + id);
            }
        }
    }])



    //---------------
    // Directives
    //---------------
    .directive('navDirective', function(){
        return {
            restrict: 'A',
            templateUrl: './templates/directives/navDirective.html'
        }
    })
    .directive('ngFiles', ['$parse', function ($parse) {

        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        };

        return {
            link: fn_link
        }
    } ])
    //---------------
    // Controllers
    //---------------
    .controller('LoginCtrl', ['$scope', 'Users', '$http', '$mdToast', '$state', function($scope, Users, $http, $mdToast, $state){
        $('.toggle').on('click', function() {
            $('.container').stop().addClass('active');
        });
        $('.close').on('click', function() {
            $('.container').stop().removeClass('active');
        });
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        $scope.showSuccess = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.deleteSuccess = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Campaign Deleted!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.showError = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.showAlert = function(ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('This is an alert title')
                    .content('You can specify some description text in here.')
                    .ariaLabel('Password notification')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };

        $scope.login = function() {
            var loginData = {
                username : this.username,
                password : this.password
            }

            Users.login(loginData)
                .success(function(data) {
                    $scope.success = data;
                    $scope.showSuccess($scope.success.message);
                    console.log($scope.success.message)
                    $state.go($scope.success.state)

                })
                .error(function(err){
                    $scope.showError(err.message);
                    console.log(err.message)
            })
        };
        $scope.connect = function() {
            $http
                .post('/connect/local', {
                    email: this.email,
                    password: this.password
                })
                .success(function(data) {
                    console.log(data);
                });
        }
        $scope.signup = function() {

            var signupData = {

                    username  : this.username,
                    password  : this.password,
                    email     : this.email,
                    firstName : this.firstName,
                    lastName  : this.lastName
                };
            console.log(signupData);
            Users.signup(signupData)

                .success(function(data){
                    console.log(data);
                    $state.go('admin.home')
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }

    }])
    .controller('ProfileCtrl', ['$scope', 'Users', '$state', '$http', function($scope, Users, $state, $http){

        $scope.defaultTheme= [

        ];
        $scope.customCss = '';

        //Custom Profile functionality
        $http.get('/api/users')
            .success(function(data) {
                if(data != null){
                    $scope.user = data; //Expose the user data to your angular scope
                    console.log($scope.user);
                }else {
                    $state.go('login');
                }

            })
            .error(function(err){
                console.log(err);
            })


    }])
    .controller('ToastCtrl', function($scope, $mdToast) {
        $scope.closeToast = function() {
            $mdToast.hide();
            };
        });
