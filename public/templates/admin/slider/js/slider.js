/**
 * Created by Frank on 10/16/2016.
 */
angular.module('KorraSlider', ['ngRoute']);


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
        .state('admin.slider', {
            url: '/slider',
            templateUrl: '/templates/admin/slider/views/slideList.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('admin.addslider', {
            url: '/addslide',
            templateUrl: '/templates/admin/slider/views/addSlide.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('admin.editslider', {
            url: '/editslide/:id',
            templateUrl: '/templates/admin/slider/views/editSlide.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostDetailCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        })



}]);
korra.factory('Slider', ['$http', function($http){
    return {
        get: function(){
            return $http.get('/api/slider');
        },
        getbyid : function(id) {
            return $http.get('/api/slider/' + id);
        },
        create : function(slideData, upfile) {
            return $http.post('/api/slider', slideData, upfile);
        },
        update : function(id, slideData) {
            return $http.put('/api/slider/' + id, slideData);
        },
        delete : function(id) {
            return $http.delete('/api/slider/' + id);
        }
    }
}])