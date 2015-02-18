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



    $scope.templateText = 'var countUp = function(n){\n' +
                      '  // Start with a for loop. Make sure you add one to n\n' +
                      '  for(var i = 0; i < n + 1; i++){\n' +
                      '    // There should be an if statement in the for loop\n' +
                      '    if(i === n){\n' +
                      '    // Log a message to the console\n' +
                      '      console.log("Almost there ...");\n' +
                      '    }\n' +
                      '    // Log the count\n' +
                      '    console.log(i);\n' +
                      '  }\n' +
                      '};\n'+
                      '// Dont forget to call the function\n' +
                      'countUp(5);';




    $scope.studentText = 'var countUp = function(n){\n' +
                      '  for(var i = 0; i < n + 1; i++){\n' +
                      '    if(i === n){\n' +
                      '      console.log("Almost there ...");\n' +
                      '    }\n' +
                      '    console.log(i);\n' +
                      '  }\n' +
                      '};\n'+
                      'countUp(5);';
    
    var spec = syntactic.specify({
        whitelist:$scope.data.whitelist,
        blacklist:$scope.data.blacklist
    });


    var text = 'while(true){};'
    syntactic.specify({
            whitelist:{Keyword: ['for']},
            blacklist:{Keyword: ['while']}
        }).verify(text).then(function(res){
            console.log(res);
      });


    var template = syntactic.outline($scope.templateText);
    // console.log(template);

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

        // console.log(templateResults);

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
            // console.log(res);
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
                        // console.log(whitelistHints);
                    }
                }

                $scope.$apply();
            }
        });
    }

  });
