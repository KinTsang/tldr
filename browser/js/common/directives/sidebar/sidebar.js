app.directive('sideBar', function(resultFactory, $rootScope) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/sidebar/sidebar.html',
        // scope: {
        //   searchResult: '='
        // },
        link: function(scope, ele, attri) {
            scope.getResult = resultFactory.getResult;
            scope.setSelected = function(result) {
                resultFactory.setSelectedResult(result);
                $rootScope.$emit("CallParentMethod")
            }
        }
    };

});

