'use strict';

/**
 * @ngdoc function
 * @name khanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the khanApp
 */
angular.module('khanApp')
  .controller('MainCtrl', function ($scope) {

    $scope.data = {
        passing:true,
        hints:{
            template:[],
            whitelist:[],
            blacklist:[]
        },
        whitelist:{
            Keyword: ['for', 'var'],
        },
        blacklist:{
            Keyword: ['while'],
        }
    };



    $scope.templateText = 'var test = function(n){\n' +
                      '  // Start with a for loop\n' +
                      '  for(var i = 0; i < n; i++){\n' +
                      '    var j = 3;\n' +
                      '    // There should be an if statement in the for loop\n' +
                      '    if(true){\n' +
                      '    // Log a message to the console\n' +
                      '      console.log(true);\n' +
                      '    }\n' +
                      '  }\n' +
                      '};';




    $scope.studentText = 'var test = function(n){\n' +
                      '  for(var i = 0; i < n; i++){\n' +
                      '    var j = 3;\n' +
                      '    if(true){\n' +
                      '      console.log("Hello!");\n' +
                      '    }\n' +
                      '  }\n' +
                      '};';
    
    var spec = syntactic.specify({
        whitelist:$scope.data.whitelist,
        blacklist:$scope.data.blacklist
    });

    var template = syntactic.outline($scope.templateText);

    $scope.templateChanged = function(){
        template = syntactic.outline($scope.templateText);
    };

    $scope.studentChanged = function(){

        // Check text against template
        var templateResults = template.verify($scope.studentText);
        $scope.data.passing = templateResults.status;
        $scope.data.hints = {
            template:[],
            whitelist:[],
            blacklist:[]
        };

        for(var hint in templateResults.hints){
            $scope.data.hints.template.push({
                type:'alert-warning',
                hint:templateResults.hints[hint]});
        }

        // Check text against whitelist/blacklist
        // ======================================
        // NOTE: this constructs hints elements that make sense for angularJS.
        // Some of this could be reduced if we add more attributes to the 
        // response object returned by the syntactic api.
        spec.verify($scope.studentText).then(function(res){
            // If the whitelist/blacklist test fails
            console.log(res);
            if(res.status === false){
                // update the passing status
                $scope.data.passing = false;

                // add hints for blacklist violations
                var blacklistHints = [];
                if(res.flags.blacklist){
                    for(var type in res.flags.blacklist){
                        var keywordRef = res.flags.blacklist[type];
                        var keyword = Object.keys(keywordRef)[0];
                        var line = keywordRef[keyword][0].start.line;
                        var hint = {
                            type:'alert-danger',
                            hint:'Dont use (' + 
                                  type + ") " + 
                                  keyword + " [line:" + line + ']'
                        }
                        blacklistHints.push(hint);
                        $scope.data.hints.blacklist = blacklistHints;
                    }
                }

                // add hints for missing whitelist items
                var whitelistHints = [];
                 if(res.flags.whitelist){
                    for(var type in res.flags.whitelist){
                        var keywordRef = res.flags.whitelist[type];
                        var keyword = Object.keys(keywordRef)[0];
                        var hint = {
                            type:'alert-info',
                            hint:'Be sure to use (' + 
                                  type + ") " + keyword
                        }
                        whitelistHints.push(hint);
                        $scope.data.hints.whitelist = whitelistHints;
                        console.log(whitelistHints);
                    }
                }

                $scope.$apply();
            }
        });
    }

  });
