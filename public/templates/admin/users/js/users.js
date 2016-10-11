/**
 * Created by Frank on 10/11/2016.
 */
angular.module('KorraUsers' ,['ngRoute']);

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

            .state('admin.users', {
                url: '/users',
                templateUrl: '/templates/admin/users/listUsers.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.edituser', {
                url: '/edituser/:id',
                templateUrl: '/templates/admin/users/editUser.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.editprofile', {
                url: '/editprofile/:id',
                templateUrl: '/templates/admin/users/editProfile.html',
                css: '/templates/admin/admin.css',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

    }]);
    korra.factory('Users', ['$http', function($http){

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