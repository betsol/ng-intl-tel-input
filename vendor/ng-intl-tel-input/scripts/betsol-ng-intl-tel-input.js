/**
 * betsol-ng-intl-tel-input - intl-tel-input integration for Angular.js
 * @version v1.0.0
 * @link https://github.com/betsol/ng-intl-tel-input
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (angular) {

  'use strict';

  angular.module('betsol.intlTelInput', [])

    .constant('intlTelInputOptions', {})

    .directive('intlTelInput', ['intlTelInputOptions', function (
      intlTelInputOptions
    ) {
      return {
        restrict: 'AC',
        require: 'ngModel',
        scope: {
          intlTelInputOptions: '=',
          intlTelInputController: '='
        },
        link: function link ($scope, $element, attrs, modelCtrl) {

          /**
           * Obtaining reference to the plugin API
           * and making sure it's present.
           */
          var pluginApi = $element.intlTelInput;
          if (!pluginApi) {
            log('intl-tel-input jQuery plugin must be loaded, skipping directive initialization');
            return;
          }

          // Building options for this control.
          var options = angular.extend({}, $scope.intlTelInputOptions || {}, intlTelInputOptions);

          // Using this flag in order to determine if we are in the control's rendering phase or not.
          // This is required for country change event right now.
          var renderingView = false;

          // Initializing the control with the plugin.
          callApi(options);

          /**
           * Updating the control's view when model changes.
           */
          modelCtrl.$render = function () {
            renderingView = true;
            callApi('setNumber', modelCtrl.$viewValue || '');
            renderingView = false;
          };

          /**
           * Validating the input using plugin's API.
           */
          modelCtrl.$validators.phoneNumber = function (modelValue, viewValue) {
            if (!modelValue && !viewValue) {
              return true;
            }
            return callApi('isValidNumber');
          };

          /**
           * Destroying the plugin with the directive.
           */
          $scope.$on('$destroy', function () {
            callApi('destroy');
          });

          /**
           * The "$setViewValue" is called when control's value has changed. It's triggered by the DOM events.
           * Angular adds all basic event listeners to the underlying input element by default,
           * and will trigger this function for us providing the .val() value as a first argument.
           *
           * Wrapping the original function in order to get the proper telephone number from the plugin's API
           * instead of the default .val() of the underlying input field.
           */
          var $setViewValue = modelCtrl.$setViewValue;
          modelCtrl.$setViewValue = function () {
            arguments[0] = callApi('getNumber');
            $setViewValue.apply(modelCtrl, arguments);
          };

          /**
           * Listening for changes of the country in order to update the model value.
           *
           * We are using "renderingView" flag in order to check if country has
           * changed by the plugin itself during control's rendering phase or it
           * was changed manually by the user.
           *
           * Using two event names for both latest and legacy versions of the plugin.
           */
          $element.bind('country-change countrychange', function () {
            if (!renderingView) {
              // It was changed by the user, so we need to update the model value.
              $scope.$evalAsync(function () {
                modelCtrl.$setViewValue('', 'countrychange');
              });
            }
          });

          $scope.intlTelInputController = {};

          $scope.intlTelInputController.setCountry = function (countryName) {
            callApi('setCountry', countryName);
          };


          function callApi () {
            return pluginApi.apply($element, arguments);
          }

        }
      };
    }])

  ;


  function log (message) {
    console.log('ng-intl-tel-input: ' + message);
  }

})(angular);
