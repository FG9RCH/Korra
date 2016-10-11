/**
 * Created by Frank on 10/10/2016.
 */

        angular.module('KorraCampaigns', ['ngRoute']);


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
            .state('admin.campaigns', {
            url: '/campaigns',
            templateUrl: '/templates/admin/campaigns/views/campaignList.html',
            css: '/templates/admin/admin.css',
            controller: 'CampaignController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
            .state('admin.addcampaigns', {
                url: '/addcampaign',
                templateUrl: '/templates/admin/campaigns/views/addCampaign.html',
                css: '/templates/admin/admin.css',
                controller: 'CampaignController',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('admin.editcampaigns', {
                url: '/editcampaign/:id',
                templateUrl: '/templates/admin/campaigns/views/editCampaign.html',
                css: '/templates/admin/admin.css',
                controller: 'CampaignDetailCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
    }]);
        korra.factory('Campaigns', ['$http', function($http){
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
        }]);
        korra.controller('CampaignController', ['$scope', 'Users', '$mdToast', 'Upload', 'Campaigns', '$mdSidenav', function ($scope, Users,  $mdToast, Upload, Campaigns, $mdSidenav) {
console.log(screen.width)
Users.loggedin()
    .success(function(user){
        $scope.user = user;
        console.log($scope.user);
    })
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
            .content('Campaign Saved!')
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
Campaigns.get()
    .success(function(data) {
        $scope.campaigns = data;

        console.log($scope.campaigns);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
$scope.addCampaign = function (file) {
    if ($scope.addCampaignForm.$valid && $scope.file) {
        console.log($scope.addCampaignForm)
        Upload.upload({
            url: '/api/campaigns',
            data: $scope.formData, // Any data needed to be submitted along with the files
            file: file
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' uploaded.');
            $scope.showSuccess();
            $scope.formData = {};
            $scope.file = 'http://placehold.it/250x200';// clear the form so our user is ready to enter another
            Campaigns.get()
                .success(function(data) {
                    $scope.campaigns = data;
                    console.log($scope.campaigns);
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
        console.log($scope.addCampaignForm.$error)
        $scope.showError();
    }


};
$scope.deleteCampaign = function(id) {
    Campaigns.delete(id)
        // if successful creation, call our get function to get all the new todos
        .success(function(data) {
            $scope.campaigns = data; // assign our new list of todos
        });
};
}]);
        korra.controller('CampaignDetailCtrl', ['$scope', '$mdToast', '$state', '$http', 'Upload', '$mdSidenav', '$stateParams', 'Campaigns', function ($scope, $mdToast, $state, $http,  Upload, $mdSidenav, $stateParams, Campaigns) {
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
                .content('Campaign Saved!')
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
    $scope.deleteCampaign = function(id) {
        Campaigns.delete(id)
            // if successful creation, call our get function to get all the new todos
            .success(function(data) {
                $scope.deleteSuccess();
                /*Campaigns.getbyid($stateParams.id)
                 .success(function(data) {
                 $scope.campaigns = data;
                 console.log($scope.campaigns);
                 })
                 .error(function(data) {
                 console.log('Error: ' + data);
                 });*/
                $state.go('admin.campaigns');
            });
    };


    Campaigns.getbyid($stateParams.id)
        .success(function(data) {
            $scope.campaigns = {};
            $scope.campaigns = data;
            console.log($scope.campaigns['imgPath']);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.editCampaign = function (file) {
        console.log($scope.file)
        if ($scope.editCampaignForm.$valid && !$scope.file) {
            Campaigns.update($stateParams.id, $scope.campaigns)
                .success(function (data) {
                    console.log($scope.campaigns);
                    $scope.showSuccess();
                    /*Campaigns.getbyid($stateParams.id)
                     .success(function(data) {
                     $scope.campaigns = data;
                     console.log($scope.campaigns);
                     })
                     .error(function(data) {
                     console.log('Error: ' + data);
                     });*/
                    $state.go('admin.campaigns');
                }).error(function(data) {
                console.log('Error: ' + data);
            });
        }else if($scope.editCampaignForm.$valid && $scope.file){
            Upload.upload({
                method: 'put',
                url: '/api/campaigns/' + id,
                data: $scope.campaigns, // Any data needed to be submitted along with the files
                file: file
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + ' uploaded.');
                $scope.showSuccess();
                /*Campaigns.getbyid($stateParams.id)
                 .success(function(data) {
                 $scope.campaigns = data;
                 console.log($scope.campaigns);
                 })
                 .error(function(data) {
                 console.log('Error: ' + data);
                 });*/
                $state.go('admin.campaigns');
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

            });
        }else{
            console.log($scope.editCampaignForm.$error)
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
