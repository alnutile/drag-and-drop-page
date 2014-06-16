'use strict';

/* Controllers */
angular.module('baApp.controllers', [])
    .controller('CampCtrl', ['$scope', '$modal', '$log',
        function($scope, $modal, $log) {

            $scope.list_sort = "sort";
            $scope.sizes = [
                { label: "s", size: 2 },
                { label: "m", size: 4 },
                { label: "l", size: 6 },
                { label: "xl",size: 12}
            ];
            $scope.content = {};
            $scope.survey = {};

            /**
             * Partials
             */
            $scope.ckedit_partail = { name: "ckedit_partial", url: "partials/ckedit.html" }
            $scope.view = {
                getView: function(type) {
                    console.log(type);
                    if(type == 'text') {
                        return "partials/ckedit.html";
                    } else if(type == 'question') {
                        return "partials/questions.html";
                    }
                }
            }
            /**
             * List for All Sortable items
             * @type {Array}
             */
            $scope.list = [];
            $scope.survey.chosen_questions = []
            $scope.survey.chosen = {};
            $scope.items = [
                { name: 'Survey 1', id: 1, type: "question" },
                { name: 'Survey 2', id: 2, type: "question" },
                { name: 'Survey 3', id: 3, type: "question" },
            ];

            $scope.content = [
                {
                    value: 'Click to Edit 1',
                    sort: 10,
                    type: 'text',
                    x: "0",
                    y: "0",
                    span: 5,
                    id: 1
                },
                {
                    value: 'Click to Edit 2',
                    sort: 2,
                    type: 'text',
                    x: "0",
                    y: "0",
                    span: 5,
                    id: 2
                },
                {
                    value: 'Click to Edit 3',
                    sort: 3,
                    type: 'text',
                    x: "0",
                    y: "0",
                    span: 8,
                    id: 3
                }
            ];

            angular.forEach($scope.content, function(v,i){
                $scope.list.push(v);
            });


            $scope.addTextBlock = function() {
                console.log($scope.content.length);
                var next = $scope.content.length + 1;
                var new_set = { value: "Click to Edit " + next, type: 'text', sort: "3", x: "0", y: "0"};
                $scope.list.push(new_set);
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
                        { value: "Example Question 1", id:"1", type: "question", span: 8 },
                        { value: "Example Question 2", id:"2", type: "question", span: 8 },
                        { value: "Example Question 3", id:"3", type: "question", span: 8 },
                        { value: "Example Question 4", id:"4", type: "question", span: 8 },
                        { value: "Example Question 5", id:"5", type: "question", span: 8 }
                    ];
                    angular.forEach($scope.survey.chosen_questions, function(v,i){
                        $scope.list.push(v);
                    });
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /** DragArea **/
            $scope.dropSuccessHandler = function($event,index,array,content_block){
//                angular.forEach(array, function(v, i){
//                    v.sort = i;
//                    array[i] = v;
//                });
                array.splice(index,1);
            };

            $scope.onDrop = function($event,$data,array){
                array.push($data);
            };

            $scope.setSizer = function(item, new_size) {
                angular.forEach($scope.list, function(v,i){
                    if(v.id == item.id && v.type == item.type) {
                        item.span = new_size;
                        $scope.list[i] = item;
                    }
                });
            }

            $scope.removeItem = function(item) {
                angular.forEach($scope.list, function(v,i){
                    if(v.id == item.id && v.type == item.type) {
                        $scope.list.splice(i, 1);
                    }
                });
            }

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