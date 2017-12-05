/**
 * External dependencies
 */
import { omitBy } from 'lodash';

const DEFAULT_DOODLE_QUERY = {
	_embed: true,
	offset: 0,
	order: 'DESC',
	order_by: 'date',
	type: 'doodle',
	status: 'publish',
	search: '',
};

/**
 * Returns a normalized doodles query, excluding any values which match the
 * default doodle query.
 *
 * @param  {Object} query Doodles query
 * @return {Object}       Normalized doodles query
 */
export function getNormalizedDoodlesQuery( query ) {
	return omitBy( query, ( value, key ) => DEFAULT_DOODLE_QUERY[ key ] === value );
}

/**
 * Returns a serialized doodles query, used as the key in the
 * `state.doodles.queries` state object.
 *
 * @param  {Object} query  Doodles query
 * @return {String}        Serialized doodles query
 */
export function getSerializedDoodlesQuery( query = {} ) {
	const normalizedQuery = getNormalizedDoodlesQuery( query );
	return JSON.stringify( normalizedQuery ).toLocaleLowerCase();
}
