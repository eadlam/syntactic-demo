'use strict';

/**
 * @ngdoc function
 * @name khanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the khanApp
 */
angular.module('khanApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
