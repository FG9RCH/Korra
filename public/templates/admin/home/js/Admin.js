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

