app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope, HomeFactory, resultFactory, $rootScope) {

    $scope.result = [];

    $scope.detail = {};

    $scope.showDetail = false;

    $scope.category = ['topRelated', 'hotTrendsDetail', 'top30in30', 'allTopCharts'];

    $scope.searching = function(category, criteria) {
        HomeFactory.searching(category, criteria)
            .then(function(result) {
                console.log(result.rss.channel[0].item)
                var newsArr = result.rss.channel[0].item

                // newsArr.map(function(iteration){
                //   return iteration.toString();
                // })

                $scope.result = result.rss.channel[0].item
                resultFactory.addtoResult(result.rss.channel[0].item)

            })
    }

    $rootScope.$on("CallParentMethod", function() {
       $scope.getSummary();
    });

    $scope.getSummary = function() {

        var topic = resultFactory.getSelectedResult();
        // console.log("This is the topic in $scope.detail:", topic);

        HomeFactory.getSummary(topic)
            .then(function(tldrSummary) {
                console.log('this is the tldr:', tldrSummary);
                $scope.detail.tldrSummary = tldrSummary;
                $scope.detail.picture = topic['ht:picture'][0];
                $scope.detail.traffic = topic['ht:approx_traffic'][0];
                $scope.detail.title = angular.element(topic['ht:news_item'][0]['ht:news_item_title'][0]).text();
                $scope.detail.url = topic['ht:news_item'][0]['ht:news_item_url'][0]
                $scope.detail.source = topic['ht:news_item'][0]['ht:news_item_source'][0]
                $scope.showDetail = true;
            })

    }

    // $scope.getSummary = function(topic) {

    //     HomeFactory.getSummary(topic)
    //         .then(function(tldrSummary) {
    //             console.log('this is the tldr:', tldrSummary);
    //             $scope.detail.tldrSummary = tldrSummary;
    //             $scope.detail.picture = topic['ht:picture'][0];
    //             $scope.detail.traffic = topic['ht:approx_traffic'][0];
    //             $scope.detail.title = HomeFactory.removeHTMLTags(topic['ht:news_item'][0]['ht:news_item_title'][0]);
    //             $scope.detail.url = topic['ht:news_item'][0]['ht:news_item_url'][0]
    //             $scope.detail.source = topic['ht:news_item'][0]['ht:news_item_source'][0]
    //             $scope.showDetail = true;
    //         })
    // }

})

app.factory('HomeFactory', function($http) {
    var obj = {};

    obj.searching = function(category, criteria) {
        console.log('ROUTE! /api/search/' + category + '/' + criteria)
        return $http.get('/api/search/' + category + '/' + criteria)
            .then((result) => result.data)
    }

    obj.getSummary = function(topic) {
        return $http.post('/api/search/getSummary', topic)
            .then((result) => result.data);
    }

    obj.removeHTMLTags = function(text) {
        console.log("THis is the input:", text)
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    return obj;

})

app.factory('resultFactory', function() {
    var result = [];
    var selectedResult = null;

    return {
        addtoResult: function(resultToBeAdded) {
            result = resultToBeAdded;
        },
        getResult: function() {
            return result;
        },
        getSelectedResult: function() {
            return selectedResult;
        },
        setSelectedResult: function(resultSelected) {
            selectedResult = resultSelected;
            // console.log("This is the setSelectedResult from result factory:", selectedResult)
        }
    }
})
