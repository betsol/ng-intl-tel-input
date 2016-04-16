/**
 * betsol-ng-intl-tel-input - intl-tel-input integration for Angular.js
 * @version v1.3.2
 * @link https://github.com/betsol/ng-intl-tel-input
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (angular) {

  'use strict';

  var VALIDATOR_NAME = 'phoneNumber';

  angular.module('betsol.intlTelInput', [])

    .constant('intlTelInputOptions', {})

    .directive('intlTelInput', ['intlTelInputOptions', function (
      intlTelInputOptions
    ) {
      return {
        restrict: 'AC',
        require: 'ngModel',
        scope: {
          intlTelInputOptions: '=?',
          intlTelInputController: '=?'
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

          // Using this flag in order to determine if we are in the process of changing the country.
          // This is required for country change event right now.
          var settingCountry = false;

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
          if ('undefined' !== typeof modelCtrl.$validators) {
            // Using newer `$validators` API.
            modelCtrl.$validators[VALIDATOR_NAME] = function (modelValue, viewValue) {
              if (!modelValue && !viewValue) {
                return true;
              }
              return isValidInput();
            };
          } else {
            // Using legacy validation approach.
            // This is required for Angular v1.2.x.
            // @todo: deprecate this in the future!
            var validateValue = function (value) {
              if (!value) {
                return value;
              }
              var isValid = isValidInput(value);
              modelCtrl.$setValidity(VALIDATOR_NAME, isValid);
              return value;
            };
            modelCtrl.$parsers.push(validateValue);
            modelCtrl.$formatters.push(validateValue);
          }

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
            if (!renderingView && !settingCountry) {
              // It was changed by the user, so we need to update the model value.
              updateViewValue('countrychange');
            }
          });

          $scope.intlTelInputController = {};

          $scope.intlTelInputController.setCountry = function (countryName) {
            settingCountry = true;
            callApi('setCountry', countryName);
            updateViewValue();
            settingCountry = false;
          };

          $scope.intlTelInputController.getExtension = function () {
            return callApi('getExtension');
          };

          $scope.intlTelInputController.getNumber = function () {
            return callApiWithArguments('getNumber', arguments);
          };

          $scope.intlTelInputController.getNumberType = function () {
            return callApi('getNumberType');
          };

          $scope.intlTelInputController.getSelectedCountryData = function () {
            return callApi('getSelectedCountryData');
          };


          function callApi () {
            return pluginApi.apply($element, arguments);
          }

          function callApiWithArguments (method, args) {
            var callArgs = Array.prototype.slice.call(args);
            callArgs.unshift(method);
            return callApi.apply(null, callArgs);
          }

          function updateViewValue (trigger) {
            $scope.$evalAsync(function () {
              modelCtrl.$setViewValue('', trigger);
            });
          }

          /**
           * Validates the passed value, or the current value of the input.
           * @todo: remove the workaround when this is implemented: https://github.com/jackocnr/intl-tel-input/issues/391
           *
           * @param {string} value
           *
           * @returns {boolean}
           */
          function isValidInput (value) {
            var useWorkaround = ('undefined' !== typeof value);
            if (useWorkaround) {
              var previousValue = $element.val();
              $element.val(value);
            }
            var result = callApi('isValidNumber');
            if (useWorkaround) {
              $element.val(previousValue);
            }
            return result;
          }

        }
      };
    }])

  ;


  function log (message) {
    console.log('ng-intl-tel-input: ' + message);
  }

})(angular);
