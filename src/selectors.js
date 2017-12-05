/**
 * Internal dependencies
 */
import {
	getSerializedDoodlesQuery,
} from './utils';

/**
 * Returns a doodle object by its global ID.
 *
 * @param  {Object} state    Global state tree
 * @param  {String} globalId Doodle global ID
 * @return {Object}          Doodle object
 */
export function getDoodle( state, globalId ) {
	return state.doodles.items[ globalId ];
}

/**
 * Returns an array of doodles for the doodles query, or null if no doodles have been
 * received.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Doodle query object
 * @return {?Array}         Doodles for the doodle query
 */
export function getDoodlesForQuery( state, query ) {
	const serializedQuery = getSerializedDoodlesQuery( query );
	if ( ! state.doodles.queries[ serializedQuery ] ) {
		return null;
	}

	return state.doodles.queries[ serializedQuery ].map( ( globalId ) => {
		return getDoodle( state, globalId );
	} ).filter( Boolean );
}

/**
 * Returns true if currently requesting doodles for the doodles query, or false
 * otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Doodle query object
 * @return {Boolean}        Whether doodles are being requested
 */
export function isRequestingDoodlesForQuery( state, query ) {
	const serializedQuery = getSerializedDoodlesQuery( query );
	return !! state.doodles.queryRequests[ serializedQuery ];
}

/**
 * Returns the number of total pages available for a given query.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Doodle query object
 * @return {int}            Number of pages
 */
export function getTotalPagesForQuery( state, query ) {
	const serializedQuery = getSerializedDoodlesQuery( query );
	if ( ! state.doodles.totalPages[ serializedQuery ] ) {
		return 1;
	}

	return parseInt( state.doodles.totalPages[ serializedQuery ], 10 );
}

/**
 * Returns true if a request is in progress for the specified doodle, or
 * false otherwise.
 *
 * @param  {Object}  state     Global state tree
 * @param  {String}  doodleSlug  Doodle Slug
 * @return {Boolean}           Whether request is in progress
 */
export function isRequestingDoodle( state, doodleSlug ) {
	if ( ! state.doodles.requests ) {
		return false;
	}

	return !! state.doodles.requests[ doodleSlug ];
}

/**
 * Returns the Doodle ID for a given page slug
 *
 * @param  {Object}  state  Global state tree
 * @param  {string}  slug   Doodle slug
 * @return {int}            Doodle ID
 */
export function getDoodleIdFromSlug( state, slug ) {
	if ( ! state.doodles.slugs[ slug ] ) {
		return false;
	}

	return state.doodles.slugs[ slug ];
}
