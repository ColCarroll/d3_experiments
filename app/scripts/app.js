'use strict';

var dashboardApp = angular.module('dataDashboardApp', ['ngRoute']);

dashboardApp.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }
        )
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'NgplotCtrl'
            })
            .otherwise({
                redirectTo: "/"
            });
    }
);


dashboardApp.controller("HeaderController", ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    }
}]);

