// butun html5 field attribute lari buraya aldim.
angular.module('ContactsApp')
	.value('FieldTypes', {
		text    : [  'Text'        , 'bir metin giriniz.'],
		email   : [  'Email'       , 'dogru email adresi giriniz.'],
		number  : [  'Number'      , 'bir rakam giriniz.'],
		date    : [  'Date'        , 'dogru bir tarih giriniz.'],
		datetime: [  'Datetime'    , 'dogru tarih/saat giriniz.'],
		time    : [  'Time'        , 'dogru bir zaman giriniz.'],
		month   : [  'Month'       , 'dogru bir ay giriniz.'],
		week    : [  'Week'    	   , 'dogru bir hafta giriniz'],
		url     : [  'URL'    	   , 'dogru bir URL giriniz.'],
		tel     : [  'Phone Number', 'dogru bir telefon numarasi giriniz.'],
		color   : [  'Color'       , 'lutfen bir renk giriniz.']
	})
	.directive('formField', function ($timeout, FieldTypes) {
		return {
			restrict    : 'EA',
			templateUrl : 'views/formField.html',
			replace     : true,
			scope       : {
					record  : '=',
					field   : '@',
					live    : '@',
					required: '@'
			},
			link: function ($scope, element, attr){

				$scope.$on('record:invalid', function (){
					$scope[$scope.field].$setDirty();
				});

				$scope.types = FieldTypes;

				$scope.remove = function (field){
					delete $scope.record[field];
					$scope.blurUpdate();
				};

				$scope.blurUpdate = function (){
					if($scope.live !== 'false'){
						$scope.record.$update(function (updatedRecord){
							$scope.record = updatedRecord;
						});
					}
				};

				var saveTimeout;
				$scope.update = function (){
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate, 1000);
				};
			}
		};
	})
	.directive('newField', function ($filter, FieldTypes){
		return {
			restrict: 'EA',
			templateUrl: 'views/new-field.html',
			replace: true,
			scope: {
				record: '=',
				live: '@'
			},
			require: '^form',
			link: function ($scope, element, attr, form){
				$scope.types = FieldTypes;
				$scope.field = {};

				$scope.show = function (type){
					$scope.field.type = type;
					$scope.display = true;
				};

				$scope.remove = function (){
					$scope.field = {};
					$scope.display = false;
				};

				$scope.add = function (){
					if (form.newField.$valid) {
						$scope.record[$filter('camelCase')($scope.field.name)] = [$scope.field.value, $scope.field.type];
						$scope.remove();
						if ($scope.live !== 'false'){
							$scope.record.$update(function (updatedRecord){
								$scope.record = updatedRecord;
							});
						}
					}
				};
			}
		};
	});
