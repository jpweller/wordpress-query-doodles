/*global SiteSettings */
/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { keyBy, reduce } from 'lodash';
import qs from 'qs';
import API from 'wordpress-rest-api-oauth-1';
const api = new API( {
	url: SiteSettings.endpoint,
} );

import {
	getSerializedDoodlesQuery,
} from './utils';

/**
 * Doodle actions
 */
export const DOODLE_REQUEST = 'wordpress-redux/doodle/REQUEST';
export const DOODLE_REQUEST_SUCCESS = 'wordpress-redux/doodle/REQUEST_SUCCESS';
export const DOODLE_REQUEST_FAILURE = 'wordpress-redux/doodle/REQUEST_FAILURE';
export const DOODLES_RECEIVE = 'wordpress-redux/doodles/RECEIVE';
export const DOODLES_REQUEST = 'wordpress-redux/doodles/REQUEST';
export const DOODLES_REQUEST_SUCCESS = 'wordpress-redux/doodles/REQUEST_SUCCESS';
export const DOODLES_REQUEST_FAILURE = 'wordpress-redux/doodles/REQUEST_FAILURE';

/**
 * Tracks all known doodle objects, indexed by doodle global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case DOODLES_RECEIVE:
			const doodles = keyBy( action.doodles, 'id' );
			return Object.assign( {}, state, doodles );
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
export function requests( state = {}, action ) {
	switch ( action.type ) {
		case DOODLE_REQUEST:
		case DOODLE_REQUEST_SUCCESS:
		case DOODLE_REQUEST_FAILURE:
			return Object.assign( {}, state, { [ action.doodleSlug ]: DOODLE_REQUEST === action.type } );
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
export function queryRequests( state = {}, action ) {
	switch ( action.type ) {
		case DOODLES_REQUEST:
		case DOODLES_REQUEST_SUCCESS:
		case DOODLES_REQUEST_FAILURE:
			const serializedQuery = getSerializedDoodlesQuery( action.query );
			return Object.assign( {}, state, {
				[ serializedQuery ]: DOODLES_REQUEST === action.type,
			} );

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
export function totalPages( state = {}, action ) {
	switch ( action.type ) {
		case DOODLES_REQUEST_SUCCESS:
			const serializedQuery = getSerializedDoodlesQuery( action.query );
			return Object.assign( {}, state, {
				[ serializedQuery ]: action.totalPages,
			} );
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
export function queries( state = {}, action ) {
	switch ( action.type ) {
		case DOODLES_REQUEST_SUCCESS:
			const serializedQuery = getSerializedDoodlesQuery( action.query );
			return Object.assign( {}, state, {
				[ serializedQuery ]: action.doodles.map( ( doodle ) => doodle.id ),
			} );
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
export function slugs( state = {}, action ) {
	switch ( action.type ) {
		case DOODLE_REQUEST_SUCCESS:
			return Object.assign( {}, state, {
				[ action.doodleSlug ]: action.doodleId,
			} );
		case DOODLES_RECEIVE:
			const doodles = reduce( action.doodles, ( memo, p ) => {
				memo[ p.slug ] = p.id;
				return memo;
			}, {} );
			return Object.assign( {}, state, doodles );
		default:
			return state;
	}
}

export default combineReducers( {
	items,
	requests,
	totalPages,
	queryRequests,
	queries,
	slugs,
} );

/**
 * Triggers a network request to fetch doodles for the specified site and query.
 *
 * @param  {String}   query  Doodle query
 * @return {Function}        Action thunk
 */
export function requestDoodles( query = {} ) {
	return ( dispatch ) => {
		dispatch( {
			type: DOODLES_REQUEST,
			query,
		} );

		query._embed = true;

		api.get( '/wp/v2/doodles', query ).then( doodles => {
			dispatch( {
				type: DOODLES_RECEIVE,
				doodles,
			} );
			requestPageCount( '/wp/v2/doodles', query ).then( count => {
				dispatch( {
					type: DOODLES_REQUEST_SUCCESS,
					query,
					totalPages: count,
					doodles,
				} );
			} );
			return null;
		} ).catch( ( error ) => {
			dispatch( {
				type: DOODLES_REQUEST_FAILURE,
				query,
				error,
			} );
		} );
	};
}

/**
 * Triggers a network request to fetch a specific doodle from a site.
 *
 * @param  {string}   doodleSlug  Doodle slug
 * @return {Function}           Action thunk
 */
export function requestDoodle( doodleSlug ) {
	return ( dispatch ) => {
		dispatch( {
			type: DOODLE_REQUEST,
			doodleSlug,
		} );

		const query = {
			slug: doodleSlug,
			_embed: true,
		};

		api.get( '/wp/v2/doodles', query ).then( data => {
			const doodle = data[ 0 ];
			dispatch( {
				type: DOODLES_RECEIVE,
				doodles: [ doodle ],
			} );
			dispatch( {
				type: DOODLE_REQUEST_SUCCESS,
				doodleId: doodle.id,
				doodleSlug,
			} );
			return null;
		} ).catch( ( error ) => {
			dispatch( {
				type: DOODLE_REQUEST_FAILURE,
				doodleSlug,
				error,
			} );
		} );
	};
}

function requestPageCount( url, data = null ) {
	if ( url.indexOf( 'http' ) !== 0 ) {
		url = `${ api.config.url }wp-json${ url }`;
	}

	if ( data ) {
		// must be decoded before being passed to ouath
		url += `?${ decodeURIComponent( qs.stringify( data ) ) }`;
		data = null;
	}

	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
	};

	return fetch( url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null,
	} )
		.then( response => {
			return parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 ) || 1;
		} );
}
