'use strict';

/* Controllers */
angular.module('baApp.controllers', [])
    .controller('CampCtrl', ['$scope', '$modal', '$log',
        function($scope, $modal, $log) {


            $scope.content = {};
            $scope.survey = {};
            /**
             * List for All Sortable items
             * @type {Array}
             */
            $scope.list = [];
            $scope.survey.chosen_questions = []
            $scope.survey.chosen = {};
            $scope.items = [
                { name: 'Survey 1', id: 1 },
                { name: 'Survey 2', id: 2 },
                { name: 'Survey 3', id: 3 }
            ];


            $scope.content = [
                {
                    value: "Click to Edit 1",
                    sort: "1",
                    x: "0",
                    y: "0"
                },
                {
                    value: "Click to Edit 2",
                    sort: "2",
                    x: "0",
                    y: "0"
                }
            ];

            angular.forEach($scope.content, function(v,i){
                $scope.list.push(v);
            });


            $scope.addTextBlock = function() {
                console.log($scope.content.length);
                var next = $scope.content.length + 1;
                var new_set = { value: "Click to Edit " + next, sort: "3", x: "0", y: "0"};
                $scope.content.push(new_set);
            };

            /* Modal for Getting Questions */
            $scope.addSurvey = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'surveys.html',
                    controller: 'ModalSurveyCtrl',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.survey.chosen = selectedItem;

                    //@todo make this more dynamic
                    $scope.survey.chosen_questions = [
                        { question: "Example Question 1", id:"1" },
                        { question: "Example Question 2", id:"2" },
                        { question: "Example Question 3", id:"3" },
                        { question: "Example Question 4", id:"4" },
                        { question: "Example Question 5", id:"5" }
                    ];
                    angular.forEach($scope.survey.chosen_questions, function(v,i){
                        $scope.list.push(v);
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /** DragArea **/
            $scope.dropSuccessHandler = function($event,index,array){
                array.splice(index,1);
            };

            $scope.onDrop = function($event,$data,array){
                array.push($data);
            };

}]).controller('ModalSurveyCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
        $scope.items = items;

        $scope.selected = {
            item: ''
        };

        $scope.ok = function () {
            $modalInstance.close($scope.survey_chosen);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectedSurvey = function(item) {
            $scope.survey_chosen = item;
            $scope.selected.item = item;
        };

}]);