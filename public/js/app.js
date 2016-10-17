/**
 * Created by Frank on 3/10/2016.
 */
    var korra = angular.module('Korra', ['ngMaterial', 'ui.router', 'ngAnimate',  'ngFileUpload', 'ngMdIcons', 'angularCSS', 'matchMedia'])

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

                    $timeout(function(){deferred.reject();}, 0);

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
            .state('home', {
                url: '/home',
                templateUrl: '/templates/public/themes/crowdfundme/home/views/home.html',
                css: '/templates/public/themes/crowdfundme/home/css/CrowdFundMe.css',
                controller: 'BodyController'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/templates/public/themes/crowdfundme/login/login.html',
                css: [ '/templates/public/themes/crowdfundme/login/reset.css', '/templates/public/themes/crowdfundme/login/login.css'],
                controller: 'LoginCtrl'
            })
            .state('login-modal', {
                url: '/login-modal',
                templateUrl: '/templates/public/themes/crowdfundme/login/login-modal.html',
                css: [ '/templates/public/themes/crowdfundme/login/reset.css', '/templates/public/themes/crowdfundme/login/login.css'],
                controller: 'BodyController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '/templates/public/themes/crowdfundme/profile/profile.html',
                css: '/templates/public/themes/crowdfundme/profile/profile.css',
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

        $urlRouterProvider.otherwise('/home');

       
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
    .directive('feNavDirective', function(){
        return {
            restrict: 'A',
            templateUrl: './templates/directives/feNavDirective.html'
        }
    })
    .directive('feCategories', function(){
        return {
            restrict: 'A',
            templateUrl: './templates/directives/feCategories.html',
            controller: 'BodyController'
        }
    })
    .directive('indieTabs', function(){
        return {
            restrict: 'A',
            templateUrl: './templates/directives/indieTabs.html',
            controller: 'BodyController'
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
    korra.controller('AdminCtrl', ['$scope',  'Users', '$state', '$mdToast',  '$mdSidenav', '$http', function($scope, Users, $state, $mdToast, $mdSidenav, $http){

        $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function(state) {
            return {abbrev: state};
        });

        Users.get()
            .success(function(data){
                $scope.users = data;
            })

        Users.loggedin()
            .success(function(data){
                $scope.currentUser = data;
                $scope.data = {
                    title: 'Korra',
                    toolbar: {
                        buttons: [{
                            name: 'Button 1',
                            icon: 'notifications_none',
                            link: 'Button 1'
                        }],
                        menus: [{
                            name: 'admin',
                            picture: '',
                            width: '4',
                            actions: [{
                                name: 'Profile',
                                message: 'Profile',
                                icon: 'person',
                                link: '#/admin/profile',
                                completed: true,
                                error: true
                            }, {
                                name: 'Settings',
                                message: 'Settings',
                                icon: 'settings',
                                link: '#/admin/settings',
                                completed: false,
                                error: false
                            }, {
                                name: 'Log Out',
                                message: 'Log Out',
                                icon: 'exit_to_app',
                                link: '/logout',
                                completed: true,
                                error: true
                            }]
                        }]
                    },
                    sidenav: {
                        sections: [{
                            name: 'Featured',
                            expand: true,
                            actions: [{
                                name: 'Home',
                                icon: 'home',
                                link: '#/admin/home'
                            }, {
                                name: 'Campaigns',
                                icon: 'beach_access',
                                link: '#/admin/campaigns'
                            }, {
                                name: 'Blog',
                                icon: 'description',
                                link: '#/admin/posts'
                            }, {
                                name: 'Users',
                                icon: 'people',
                                link: '#/admin/users'
                            }]
                        }, {
                            name: 'Settings',
                            expand: true,
                            actions: [{
                                name: 'Main',
                                icon: 'settings',
                                link: '#/admin/settings'
                            },{
                                name: 'Theme',
                                icon: 'web',
                                link: '#/admin/themes'
                            }]
                        }, {
                            name: 'Developer',
                            expand: false,
                            actions: [{
                                name: 'Action 4',
                                icon: 'settings',
                                link: 'Action 4'
                            }, {
                                name: 'Action 5',
                                icon: 'settings',
                                link: 'Action 5'
                            }, {
                                name: 'Action 6',
                                icon: 'settings',
                                link: 'Action 6'
                            }]
                        }]
                    },
                    content: {
                        lists: [{
                            name: 'List 1',
                            menu: {
                                name: 'Menu 1',
                                icon: 'settings',
                                width: '4',
                                actions: [{
                                    name: 'Action 1',
                                    message: 'Action 1',
                                    completed: true,
                                    error: true
                                }]
                            },
                            items: [{
                                name: 'Item 1',
                                description: 'Description 1',
                                link: 'Item 1'
                            }, {
                                name: 'Item 2',
                                description: 'Description 2',
                                link: 'Item 2'
                            }, {
                                name: 'Item 3',
                                description: 'Description 3',
                                link: 'Item 3'
                            }]
                        }]
                    }
                }
                if($scope.currentUser.facebook){
                    $scope.user = {
                        name: $scope.currentUser.facebook.name,
                        email: $scope.currentUser.facebook.email,
                        picture: $scope.currentUser.facebook.picture
                    }


                }else if($scope.currentUser.local) {
                    $scope.user = {
                        name:  $scope.currentUser.local.username,
                        email: $scope.currentUser.local.email,
                        picture: $scope.currentUser.local.picture || './uploads/user.jpg'

                    }
                }

                $scope.adminLink = function (){
                    $state.go()
                }

                $scope.updateProfile = function(id, profileData){

                    id = $scope.currentUser._id;
                    profileData = {

                        name: $scope.currentUser.local.name,
                        email: $scope.currentUser.local.email,
                        username: $scope.currentUser.local.username,
                        password: $scope.currentUser.local.password,
                    }

                    console.log()
                    Users.update(id, profileData)
                        .success(function(data){
                            console.log(data)
                        })
                }


            })
            .error(function(err){
                console.log(err);
            })


        $scope.toggleSidenav = function(menu) {
            $mdSidenav(menu).toggle();
        }
        $scope.toast = function(message) {
            var toast = $mdToast.simple().content('You clicked ' + message).position('bottom right');
            $mdToast.show(toast);
        };
        $scope.toastList = function(message) {
            var toast = $mdToast.simple().content('You clicked ' + message + ' having selected ' + $scope.selected.length + ' item(s)').position('bottom right');
            $mdToast.show(toast);
        };
        $scope.selected = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };



    }])

    .controller('LoginCtrl', ['$scope', 'Users', '$mdToast ', '$http',  '$state', function($scope, Users, $mdToast, $http,  $state){
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
        })
    .controller('BodyController', ["$scope", 'Users', '$state',  'screenSize', '$mdToast', '$mdDialog', function ($scope, Users, $state, screenSize, $mdToast, $mdDialog) {
      /*  $(document).ready(function(){
        $('.button-collapse').sideNav('show')
        // Hide sideNav
        $('.button-collapse').sideNav('hide')

        $('select').material_select();
    })*/
        var originatorEv;

        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        Users.loggedin()
                .success(function(data){
                    $scope.user = data;
                    console.log(data);
                    var adjustSlider = function(){
                        document.getElementById('carouselul').style.left = '2177px'
                    };
                    adjustSlider();
                })
                .error(function(err){
                    console.log(err);
                });
        $scope.toastPosition = {
            bottom: true,
            top: false,
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
        $scope.showError = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.showLogin = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            var elementWrapper = {};
            elementWrapper.target = document.getElementById('#modalContainer');
            $mdDialog.show({
                parent: angular.element(document.querySelector('#modalContainer')),
                clickOutsideToClose: true,
                autoWrap: true,
                templateUrl: './templates/public/themes/crowdfundme/login/login-modal.html',
                controller: 'BodyController',
                ariaLabel: 'Alert Dialog Demo',
                ok: 'Got it!',
                targetEvent: elementWrapper
        });
        };
        $scope.showSignup = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show({
                parent: angular.element(document.querySelector('#modalContainer')),
                clickOutsideToClose: true,
                autoWrap: true,
                templateUrl: './templates/public/themes/crowdfundme/signup/signup-modal.html',
                controller: 'BodyController',
                ariaLabel: 'Sign up',
                ok: 'Got it!',
                targetEvent: ev
            });
        };
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };
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
                    $scope.success = data;
                    $scope.showSuccess($scope.success.message);
                    $scope.closeDialog();
                    $('.jcarousel').jcarousel('destroy');
                    console.log($scope.success.message);
                    $state.go('home')
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
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
                    $scope.closeDialog();
                    $('.jcarousel').jcarousel('destroy');
                    console.log($scope.success.message);
                    $state.reload('home')

                })
                .error(function(err){
                    $scope.showError(err.message);
                    console.log(err.message)
                })
        };
        $(document).ready(function(){
            $('ul.indieTabs').tabs();
        });

    /*
     Carousel initialization
     */
    $('.jcarousel')
        .on('jcarousel:targetin', 'li', function() {
            $(this).addClass('showCaption');
        })
        .on('jcarousel:targetout', 'li', function() {
            $(this).removeClass('showCaption');
        })
        .on('jcarousel:createend', function() {



        })
        .jcarousel({
            wrap: 'circular',
            center: true
        });

    $('.jcarousel').jcarouselAutoscroll({
        interval: 5000,
        target: '+=1',

    });

    /*
     Prev control initialization
     */
    $('.jcarousel-control-prev')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            // Options go here
            target: '-=1'
        });

    /*
     Next control initialization
     */
    $('.jcarousel-control-next')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            // Options go here
            target: '+=1'
        });

    /*
     Pagination initialization
     */
    $('.jcarousel-pagination')
        .on('jcarouselpagination:active', 'a', function() {
            $(this).addClass('active');
        })
        .on('jcarouselpagination:inactive', 'a', function() {
            $(this).removeClass('active');
        })
        .jcarouselPagination({
            // Options go here
        });


    $scope.desktop = screenSize.on('md, lg', function (match) {
        $scope.desktop = match;
    });
    $scope.mobile = screenSize.on('xs, sm', function (match) {
        $scope.mobile = match;
    });


    $scope.select = {
        value1: "Option1",
        value2: "I'm an option",
        choices: ["Option1", "I'm an option", "This is materialize", "No, this is Patrick."]
    };

    $scope.dummyInputs = {};

}])
    .controller('CollapsibleController', ["$scope", function ($scope) {
        $scope.collapsibleElements = [{
            icon: 'mdi-image-filter-drama',
            title: 'First',
            content: 'Lorem ipsum dolor sit amet.'
        },{
            icon: 'mdi-maps-place',
            title: 'Second',
            content: 'Lorem ipsum dolor sit amet.'
        },{
            icon: 'mdi-social-whatshot',
            title: 'Third',
            content: 'Lorem ipsum dolor sit amet.'
        }];
    }]).controller('ToastController', ["$scope", function ($scope) {
        $scope.callback = function(message) {
            alert(message);
        };
    }]).controller('PaginationController', ["$scope", function ($scope) {
        $scope.changePage = function (page) {
            Materialize.toast("Changed to page " + page, 1000);
        }
    }])
    .controller('DateController', ["$scope", function ($scope) {
        var currentTime = new Date();
        $scope.currentTime = currentTime;
        $scope.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        $scope.disable = [false, 1, 7];
        $scope.today = 'Today';
        $scope.clear = 'Clear';
        $scope.close = 'Close';
        var days = 15;
        $scope.minDate = (new Date($scope.currentTime.getTime() - ( 1000 * 60 * 60 *24 * days ))).toISOString();
        $scope.maxDate = (new Date($scope.currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();
        $scope.onStart = function () {
            console.log('onStart');
        };
        $scope.onRender = function () {
            console.log('onRender');
        };
        $scope.onOpen = function () {
            console.log('onOpen');
        };
        $scope.onClose = function () {
            console.log('onClose');
        };
        $scope.onSet = function () {
            console.log('onSet');
        };
        $scope.onStop = function () {
            console.log('onStop');
        };
    }]);