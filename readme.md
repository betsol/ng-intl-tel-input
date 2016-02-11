# betsol-ng-intl-tel-input

[![Bower version](https://badge.fury.io/bo/betsol-ng-intl-tel-input.svg)](http://badge.fury.io/bo/betsol-ng-intl-tel-input)
[![npm version](https://badge.fury.io/js/betsol-ng-intl-tel-input.svg)](http://badge.fury.io/js/betsol-ng-intl-tel-input)


This module for Angular.js provides integration
for the great [intl-tel-input][intl-tel-input] jQuery plugin.

Please feel free to investigate [the original plugin][intl-tel-input]
for mode details, [features][intl-tel-input-features] and
[configuration][intl-tel-input-options].


## Installation

### Original plugin

Please install the original plugin first. Use the [following guide][intl-tel-input-install].

### Install integration library with `NPM` or `Bower`

- `npm i --save betsol-ng-intl-tel-input`

- `bower install --save betsol-ng-intl-tel-input`


### Add integration library to your page

``` html
<script src="../betsol-ng-intl-tel-input/dist/betsol-ng-intl-tel-input.js"></script>
```

You should use minified version (`betsol-ng-intl-tel-input.min.js`) in production.


### Add dependency in your application's module definition

``` javascript
var application = angular.module('application', [
  // ...
  'betsol.intlTelInput'
]);
```

### Introduce the directive

To add the plugin to any input field please use the `intl-tel-input` directive:

`<input type="tel" ng-model="user.phoneNumber" intl-tel-input>`


## Configuration

### Global

You can configure the plugin by changing the global object `intlTelInputOptions`.
This will apply specified changes across all plugin instances in your application.
All configuration options could be found in the [original plugin documentation][intl-tel-input-options].

#### Global Configuration Example

```javascript
angular
  .module('app', [])
  .config(function (intlTelInputOptions) {
    angular.extend(intlTelInputOptions, {
      nationalMode: false,
      utilsScript: '/vendor/intl-tel-input/utils.js',
      defaultCountry: 'auto',
      preferredCountries: ['ru', 'kz'],
      autoFormat: true,
      autoPlaceholder: true
    });
  })
;
```

### Custom instance configuration

You can configure each input field individually by
specifying the configuration options via `intl-tel-input-options` attribute.

#### Instance Configuration Example

```html
<input
    type="tel"
    ng-model="user.phoneNumber"
    intl-tel-input
    intl-tel-input-options="{ excludeCountries: ['us', 'de'] }"
>
```

## API

You can use `intl-tel-input-controller` attribute to specify an object
that will be populated with the directive's API functions.

### API Usage Example

```javascript
angular
  .module('app', [])
  .controller(function ($scope) {
    $scope.myIntlTelInputCtrl = {};
    $scope.changeCountryToRussia = function () {
      $scope.myIntlTelInputCtrl.setCountry('ru');
    };
  })
;
```

```html
<input
    type="tel"
    ng-model="user.phoneNumber"
    intl-tel-input
    intl-tel-input-controller="myIntlTelInputCtrl"
>
<button ng-click="changeCountryToRussia()">
    Change Country to Russia
</button>
```


### List of Supported API Functions:

- `setCountry({string} countryCode)`


## Changelog

Please see the [changelog][changelog] for list of changes.


## Feedback

If you have found a bug or have another issue with the library —
please [create an issue][new-issue].

If you have a question regarding the library or it's integration with your project —
consider asking a question at [StackOverflow][so-ask] and sending me a
link via [E-Mail][email]. I will be glad to help.

Have any ideas or propositions? Feel free to contact me by [E-Mail][email].

Cheers!


## FAQ

@todo


## Developer guide

Fork, clone, create a feature branch, implement your feature, cover it with tests, commit, create a PR.

Run:

- `npm i && bower install` to initialize the project
- `gulp build` to re-build the dist files
- `gulp test` or `karma start` to test the code

Do not add dist files to the PR itself.
We will re-compile the module manually each time before releasing.


## Support

If you like this library consider to add star on [GitHub repository][repo-gh].

Thank you!


## License

The MIT License (MIT)

Copyright (c) 2016 Slava Fomin II, BETTER SOLUTIONS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

  [changelog]: changelog.md
  [so-ask]:    http://stackoverflow.com/questions/ask?tags=angularjs,javascript
  [email]:     mailto:s.fomin@betsol.ru
  [new-issue]: https://github.com/betsol/ng-intl-tel-input/issues/new
  [gulp]:      http://gulpjs.com/
  [repo-gh]:   https://github.com/betsol/ng-intl-tel-input

  [intl-tel-input]:          https://github.com/jackocnr/intl-tel-input
  [intl-tel-input-features]: https://github.com/jackocnr/intl-tel-input#features
  [intl-tel-input-options]:  https://github.com/jackocnr/intl-tel-input#options
  [intl-tel-input-install]:  https://github.com/jackocnr/intl-tel-input#getting-started
