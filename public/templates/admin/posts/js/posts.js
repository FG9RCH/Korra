/**
 * Created by Frank on 10/10/2016.
 */

    angular.module('KorraPosts', ['ngRoute']);


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
        .state('admin.posts', {
            url: '/posts',
            templateUrl: '/templates/admin/posts/views/postList.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('admin.addposts', {
            url: '/addpost',
            templateUrl: '/templates/admin/posts/views/addPost.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('admin.editposts', {
            url: '/editpost/:id',
            templateUrl: '/templates/admin/posts/views/editPost.html',
            css: '/templates/admin/newAdmincss.css',
            controller: 'PostDetailCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        })



}]);
    korra.factory('Posts', ['$http', function($http){
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
    korra.controller('PostController', ['$scope', '$mdToast', 'Upload', 'Posts', '$mdSidenav', function ($scope, $mdToast, Upload, Posts, $mdSidenav) {
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

    korra.controller('PostDetailCtrl', ['$scope', '$mdToast', '$state', '$http', 'Upload', '$mdSidenav', '$stateParams', 'Posts', function ($scope, $mdToast, $state, $http,  Upload, $mdSidenav, $stateParams, Posts) {
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

