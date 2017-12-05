'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omitBy2 = require('lodash/omitBy');

var _omitBy3 = _interopRequireDefault(_omitBy2);

exports.getNormalizedDoodlesQuery = getNormalizedDoodlesQuery;
exports.getSerializedDoodlesQuery = getSerializedDoodlesQuery;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * External dependencies
 */
var DEFAULT_DOODLE_QUERY = {
  _embed: true,
  offset: 0,
  order: 'DESC',
  order_by: 'date',
  type: 'doodle',
  status: 'publish',
  search: ''
};

/**
 * Returns a normalized doodles query, excluding any values which match the
 * default doodle query.
 *
 * @param  {Object} query Doodles query
 * @return {Object}       Normalized doodles query
 */
function getNormalizedDoodlesQuery(query) {
  return (0, _omitBy3.default)(query, function (value, key) {
    return DEFAULT_DOODLE_QUERY[key] === value;
  });
}

/**
 * Returns a serialized doodles query, used as the key in the
 * `state.doodles.queries` state object.
 *
 * @param  {Object} query  Doodles query
 * @return {String}        Serialized doodles query
 */
function getSerializedDoodlesQuery() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var normalizedQuery = getNormalizedDoodlesQuery(query);
  return JSON.stringify(normalizedQuery).toLocaleLowerCase();
}