/**
 * Created by Frank on 10/10/2016.
 */
 angular.module('KorraAdmin' ,['ngRoute']);

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

    korra.config(['$stateProvider', '$httpProvider',  function($stateProvider, $httpProvider) {

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

            .state('admin.home', {
                url: '/home',
                templateUrl: '/templates/admin/home/views/home.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

    }]);
    korra.controller('AdminCtrl', ['$scope',  'Users', '$state', '$mdToast',  '$mdSidenav', '$http', function($scope, Users, $state, $mdToast, $mdSidenav, $http){

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

