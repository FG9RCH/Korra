/**
 * Created by Frank on 3/10/2016.
 */
    angular.module('Korra', ['ngMaterial', 'ui.router', 'ngFileUpload', 'ngMdIcons', 'angularCSS'])

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
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.home', {
                url: '/home',
                templateUrl: '/templates/admin/home/home.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

            .state('admin.posts', {
                url: '/posts',
                templateUrl: '/templates/admin/posts/postList.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'PostController',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.addposts', {
                url: '/addpost',
                templateUrl: '/templates/admin/posts/addPost.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'PostController',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.editposts', {
                url: '/editpost/:id',
                templateUrl: '/templates/admin/posts/editPost.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'PostDetailCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: '/templates/admin/users/listUsers.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.edituser', {
                url: '/edituser/:id',
                templateUrl: '/templates/admin/users/editUser.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.editprofile', {
                url: '/editprofile/:id',
                templateUrl: '/templates/admin/users/editProfile.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.settings', {
                url: '/settings',
                templateUrl: '/templates/admin/settings/settings.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.themes', {
                url: '/themes',
                templateUrl: '/templates/admin/settings/theme.html',
                css: '/templates/admin/newAdmincss.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('public', {
                url: '/public',
                templateUrl: '/templates/public/home/home.html',
                css: '/templates/public/home/CrowdFundMe.css',
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
    .factory('Users', ['$http', function($http){

        return {
            get: function(){
                return $http.get('/api/users');
            },
            getbyid : function(id) {
                return $http.get('/api/users/' + id);
            },
            signup : function(userData) {
                return $http.post('/api/signup', userData);
            },
            login : function(userData) {
                return $http.post('/api/login', userData);
            },
            loggedin : function() {
                return $http.get('/loggedin');
            },
            update : function(id, userData) {
                return $http.put('/api/users/' + id , userData);
            },
            delete : function(id) {
                return $http.delete('/api/users/' + id);
            }
        }
    }])



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
    .factory('Campaigns', ['$http', function($http){
        return {
                   get: function(){
                    return $http.get('/api/campaigns');
                   },
                   getbyid : function(id) {
                    return $http.get('/api/campaigns/' + id);
                   },
                   create : function(campaignData, upfile) {
                    return $http.post('/api/campaigns', campaignData, upfile);
                   },
                   update : function(id, campaignData) {
                        return $http.put('/api/campaigns/' + id, campaignData);
                   },
                   delete : function(id) {
                    return $http.delete('/api/campaigns/' + id);
                   }
        }
    }])
    .factory('Posts', ['$http', function($http){
        return {
            get: function(){
                return $http.get('/api/posts');
            },
            getbyid : function(id) {
                return $http.get('/api/posts/' + id);
            },
            create : function(postData, upfile) {
                return $http.post('/api/posts', postData, upfile);
            },
            update : function(id, postData) {
                return $http.put('/api/posts/' + id, postData);
            },
            delete : function(id) {
                return $http.delete('/api/posts/' + id);
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
                }
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
    .controller('AdminCtrl', ['$scope',  'Users', '$state', '$mdToast',  '$mdSidenav', '$http', function($scope, Users, $state, $mdToast, $mdSidenav, $http){

        $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function(state) {
            return {abbrev: state};
        });

        Users.get()
            .success(function(data){
                $scope.users = data;
                console.log($scope.users);
            })

        Users.loggedin()
            .success(function(data){
                $scope.currentUser = data;
                console.log($scope.currentUser);
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
    .controller('PostController', ['$scope', '$mdToast', 'Upload', 'Posts', '$mdSidenav', function ($scope, $mdToast, Upload, Posts, $mdSidenav) {
        console.log(screen.width)

        $scope.formData = {};
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
        $scope.showSuccess = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Post Saved!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.deleteSuccess = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Post Deleted!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.showError = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Error! Please fill in all form fields')
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
        $scope.openLeftMenu = function() {
            $mdSidenav('left').toggle();
        };
        Posts.get()
            .success(function(data) {
                $scope.posts = data;

                console.log($scope.posts);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.addPost = function (file) {
            if ($scope.addPostForm.$valid && $scope.file) {
                console.log($scope.addPostForm)
                Upload.upload({
                    url: '/api/posts',
                    data: $scope.formData, // Any data needed to be submitted along with the files
                    file: file
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + ' uploaded.');
                    $scope.showSuccess();
                    $scope.formData = {};
                    $scope.file = 'http://placehold.it/250x200';// clear the form so our user is ready to enter another
                    Posts.get()
                        .success(function(data) {
                            $scope.posts = data;
                            console.log($scope.posts);
                        })
                        .error(function(data) {
                            console.log('Error: ' + data);
                        });
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

                });

            } else {
                console.log($scope.addPostForm.$error)
                $scope.showError();
            }


        };
        $scope.deletePost = function(id) {
            Posts.delete(id)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.posts = data; // assign our new list of todos
                });
        };
    }])
    .controller('PostDetailCtrl', ['$scope', '$mdToast', '$state', '$http', 'Upload', '$mdSidenav', '$stateParams', 'Posts', function ($scope, $mdToast, $state, $http,  Upload, $mdSidenav, $stateParams, Posts) {
        var id = $stateParams.id;
        $scope.formData = {};
        $scope.required = true;
        $scope.isSidenavOpen = true;
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
        $scope.showSuccess = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Post Saved!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.deleteSuccess = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Post Deleted!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        $scope.showError = function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Error! Please fill in all form fields')
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
        $scope.deletePost = function(id) {
            Posts.delete(id)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.deleteSuccess();
                    /*Posts.getbyid($stateParams.id)
                     .success(function(data) {
                     $scope.posts = data;
                     console.log($scope.posts);
                     })
                     .error(function(data) {
                     console.log('Error: ' + data);
                     });*/
                    $state.go('admin.posts');
                });
        };


        Posts.getbyid($stateParams.id)
            .success(function(data) {
                $scope.posts = {};
                $scope.posts = data;
                console.log($scope.posts['imgPath']);

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.editPost = function (file) {
            console.log($scope.file)
            if ($scope.editPostForm.$valid && !$scope.file) {
                Posts.update($stateParams.id, $scope.posts)
                    .success(function (data) {
                        console.log($scope.posts);
                        $scope.showSuccess();
                        /*Posts.getbyid($stateParams.id)
                         .success(function(data) {
                         $scope.posts = data;
                         console.log($scope.posts);
                         })
                         .error(function(data) {
                         console.log('Error: ' + data);
                         });*/
                        $state.go('admin.posts');
                    }).error(function(data) {
                    console.log('Error: ' + data);
                });
            }else if($scope.editPostForm.$valid && $scope.file){
                Upload.upload({
                    method: 'put',
                    url: '/api/posts/' + id,
                    data: $scope.posts, // Any data needed to be submitted along with the files
                    file: file
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + ' uploaded.');
                    $scope.showSuccess();
                    /*Posts.getbyid($stateParams.id)
                     .success(function(data) {
                     $scope.posts = data;
                     console.log($scope.posts);
                     })
                     .error(function(data) {
                     console.log('Error: ' + data);
                     });*/
                    $state.go('admin.posts');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

                });
            }else{
                console.log($scope.editPostForm.$error)
                $scope.showError();
            }
        };
        $scope.openLeftMenu = function() {
            $mdSidenav('left').toggle();
        };
        $scope.$watch('isSidenavOpen', function(isSidenavOpen) {
            if (isSidenavOpen){

            }
        });
    }])
    .controller('ToastCtrl', function($scope, $mdToast) {
        $scope.closeToast = function() {
            $mdToast.hide();
            };
        });
