'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var postcss = _interopRequireWildcard(_postcss);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = postcss.plugin('postcss-define-units', function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (css) {
    var save = {};

    css.walkDecls(function (decl) {
      if (decl.prop === '--define') {
        var _postcss$list$space = postcss.list.space(decl.value);

        var type = _postcss$list$space[0];
        var value = _postcss$list$space[1];


        if (value.charAt(0) == '(') {
          var _value$match = value.match(/\((.+)\)(\w+|\%)/);

          var _ = _value$match[0];
          var expression = _value$match[1];
          var postfix = _value$match[2];

          save[type] = [new Function('value', ['return', '(', expression, ')'].join(' ')), postfix];
        } else {
          (function () {
            var _value$match2 = value.match(/(\d+)(\w+)/);

            var _ = _value$match2[0];
            var count = _value$match2[1];
            var postfix = _value$match2[2];

            save[type] = [function (value) {
              return count * value;
            }, postfix];
          })();
        }

        decl.remove();
      } else {
        var _loop = function _loop(_type) {
          var _save$_type = save[_type];
          var f = _save$_type[0];
          var postfix = _save$_type[1];

          var reg = new RegExp("(([\\d\.]+)" + _type + ")", 'g');

          decl.value = decl.value.replace(reg, function (a, b, c) {
            return [f(c), postfix].join('');
          });
        };

        for (var _type in save) {
          _loop(_type);
        }
      }
    });
  };
});
