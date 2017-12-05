'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DOODLES_REQUEST_FAILURE = exports.DOODLES_REQUEST_SUCCESS = exports.DOODLES_REQUEST = exports.DOODLES_RECEIVE = exports.DOODLE_REQUEST_FAILURE = exports.DOODLE_REQUEST_SUCCESS = exports.DOODLE_REQUEST = undefined;

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _keyBy2 = require('lodash/keyBy');

var _keyBy3 = _interopRequireDefault(_keyBy2);

exports.items = items;
exports.requests = requests;
exports.queryRequests = queryRequests;
exports.totalPages = totalPages;
exports.queries = queries;
exports.slugs = slugs;
exports.requestDoodles = requestDoodles;
exports.requestDoodle = requestDoodle;

var _redux = require('redux');

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _wordpressRestApiOauth = require('wordpress-rest-api-oauth-1');

var _wordpressRestApiOauth2 = _interopRequireDefault(_wordpressRestApiOauth);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*global SiteSettings */
/**
 * External dependencies
 */


var api = new _wordpressRestApiOauth2.default({
	url: SiteSettings.endpoint
});

/**
 * Doodle actions
 */
var DOODLE_REQUEST = exports.DOODLE_REQUEST = 'wordpress-redux/doodle/REQUEST';
var DOODLE_REQUEST_SUCCESS = exports.DOODLE_REQUEST_SUCCESS = 'wordpress-redux/doodle/REQUEST_SUCCESS';
var DOODLE_REQUEST_FAILURE = exports.DOODLE_REQUEST_FAILURE = 'wordpress-redux/doodle/REQUEST_FAILURE';
var DOODLES_RECEIVE = exports.DOODLES_RECEIVE = 'wordpress-redux/doodles/RECEIVE';
var DOODLES_REQUEST = exports.DOODLES_REQUEST = 'wordpress-redux/doodles/REQUEST';
var DOODLES_REQUEST_SUCCESS = exports.DOODLES_REQUEST_SUCCESS = 'wordpress-redux/doodles/REQUEST_SUCCESS';
var DOODLES_REQUEST_FAILURE = exports.DOODLES_REQUEST_FAILURE = 'wordpress-redux/doodles/REQUEST_FAILURE';

/**
 * Tracks all known doodle objects, indexed by doodle global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLES_RECEIVE:
			var doodles = (0, _keyBy3.default)(action.doodles, 'id');
			return Object.assign({}, state, doodles);
		default:
			return state;
	}
}

/**
 * Returns the updated doodle requests state after an action has been
 * dispatched. The state reflects a mapping of doodle ID to a
 * boolean reflecting whether a request for the doodle is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function requests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLE_REQUEST:
		case DOODLE_REQUEST_SUCCESS:
		case DOODLE_REQUEST_FAILURE:
			return Object.assign({}, state, _defineProperty({}, action.doodleSlug, DOODLE_REQUEST === action.type));
		default:
			return state;
	}
}

/**
 * Returns the updated doodle query requesting state after an action has been
 * dispatched. The state reflects a mapping of serialized query to whether a
 * network request is in-progress for that query.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function queryRequests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLES_REQUEST:
		case DOODLES_REQUEST_SUCCESS:
		case DOODLES_REQUEST_FAILURE:
			var serializedQuery = (0, _utils.getSerializedDoodlesQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, DOODLES_REQUEST === action.type));

		default:
			return state;
	}
}

/**
 * Tracks the page length for a given query.
 * @todo Bring in the "without paged" util, to reduce duplication
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function totalPages() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLES_REQUEST_SUCCESS:
			var serializedQuery = (0, _utils.getSerializedDoodlesQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, action.totalPages));
		default:
			return state;
	}
}

/**
 * Returns the updated doodle query state after an action has been dispatched.
 * The state reflects a mapping of serialized query key to an array of doodle
 * global IDs for the query, if a query response was successfully received.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function queries() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLES_REQUEST_SUCCESS:
			var serializedQuery = (0, _utils.getSerializedDoodlesQuery)(action.query);
			return Object.assign({}, state, _defineProperty({}, serializedQuery, action.doodles.map(function (doodle) {
				return doodle.id;
			})));
		default:
			return state;
	}
}

/**
 * Tracks the slug->ID mapping for doodles
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function slugs() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case DOODLE_REQUEST_SUCCESS:
			return Object.assign({}, state, _defineProperty({}, action.doodleSlug, action.doodleId));
		case DOODLES_RECEIVE:
			var doodles = (0, _reduce3.default)(action.doodles, function (memo, p) {
				memo[p.slug] = p.id;
				return memo;
			}, {});
			return Object.assign({}, state, doodles);
		default:
			return state;
	}
}

exports.default = (0, _redux.combineReducers)({
	items: items,
	requests: requests,
	totalPages: totalPages,
	queryRequests: queryRequests,
	queries: queries,
	slugs: slugs
});

/**
 * Triggers a network request to fetch doodles for the specified site and query.
 *
 * @param  {String}   query  Doodle query
 * @return {Function}        Action thunk
 */

function requestDoodles() {
	var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return function (dispatch) {
		dispatch({
			type: DOODLES_REQUEST,
			query: query
		});

		query._embed = true;

		api.get('/wp/v2/doodles', query).then(function (doodles) {
			dispatch({
				type: DOODLES_RECEIVE,
				doodles: doodles
			});
			requestPageCount('/wp/v2/doodles', query).then(function (count) {
				dispatch({
					type: DOODLES_REQUEST_SUCCESS,
					query: query,
					totalPages: count,
					doodles: doodles
				});
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: DOODLES_REQUEST_FAILURE,
				query: query,
				error: error
			});
		});
	};
}

/**
 * Triggers a network request to fetch a specific doodle from a site.
 *
 * @param  {string}   doodleSlug  Doodle slug
 * @return {Function}           Action thunk
 */
function requestDoodle(doodleSlug) {
	return function (dispatch) {
		dispatch({
			type: DOODLE_REQUEST,
			doodleSlug: doodleSlug
		});

		var query = {
			slug: doodleSlug,
			_embed: true
		};

		api.get('/wp/v2/doodles', query).then(function (data) {
			var doodle = data[0];
			dispatch({
				type: DOODLES_RECEIVE,
				doodles: [doodle]
			});
			dispatch({
				type: DOODLE_REQUEST_SUCCESS,
				doodleId: doodle.id,
				doodleSlug: doodleSlug
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: DOODLE_REQUEST_FAILURE,
				doodleSlug: doodleSlug,
				error: error
			});
		});
	};
}

function requestPageCount(url) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	if (url.indexOf('http') !== 0) {
		url = api.config.url + 'wp-json' + url;
	}

	if (data) {
		// must be decoded before being passed to ouath
		url += '?' + decodeURIComponent(_qs2.default.stringify(data));
		data = null;
	}

	var headers = {
		Accept: 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch(url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null
	}).then(function (response) {
		return parseInt(response.headers.get('X-WP-TotalPages'), 10) || 1;
	});
}