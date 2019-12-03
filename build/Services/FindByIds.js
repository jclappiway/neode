'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = FindByIds;

var _Builder = require('../Query/Builder');

var _Builder2 = _interopRequireDefault(_Builder);

var _EagerUtils = require('../Query/EagerUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FindByIds(neode, model, ids) {
    var alias = 'this';

    var builder = new _Builder2.default(neode);

    return builder.match(alias, model).whereRaw('ID(' + alias + ') IN [' + ids.join(',') + ']').return((0, _EagerUtils.eagerNode)(neode, 1, alias, model)).execute(_Builder.mode.READ).then(function (res) {
        return neode.hydrate(res, alias, model);
    });
}