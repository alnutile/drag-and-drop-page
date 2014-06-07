'use strict';


// Declare app level module which depends on filters, and services
angular.module('baApp', [
  'ngRoute',
  'ngMockE2E',
  'baApp.filters',
  'baApp.services',
  'baApp.directives',
  'baApp.controllers'
]).
run(function($httpBackend){
        $httpBackend.whenGET(/^partials\//).passThrough();
    }).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit', {templateUrl: 'partials/edit.html', controller: 'CampCtrl'});
  $routeProvider.otherwise({redirectTo: '/edit'});
}]);
