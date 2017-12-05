/**
 * External dependencies
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debugFactory from 'debug';
import PropTypes from 'prop-types';
import shallowEqual from 'shallowequal';

/**
 * Internal dependencies
 */
import { isRequestingDoodlesForQuery, isRequestingDoodle } from './selectors';
import { requestDoodles, requestDoodle } from './state';

const debug = debugFactory( 'query:doodle' );

class QueryDoodles extends Component {
	componentWillMount() {
		this.request( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if (
			this.props.doodleSlug === nextProps.doodleSlug &&
			shallowEqual( this.props.query, nextProps.query )
		) {
			return;
		}

		this.request( nextProps );
	}

	request( props ) {
		const single = !! props.doodleSlug;

		if ( ! single && ! props.requestingDoodles ) {
			debug( `Request doodle list using query ${ props.query }` );
			props.requestDoodles( props.query );
		}

		if ( single && ! props.requestingDoodle ) {
			debug( `Request single doodle ${ props.doodleSlug }` );
			props.requestDoodle( props.doodleSlug );
		}
	}

	render() {
		return null;
	}
}

QueryDoodles.propTypes = {
	doodleSlug: PropTypes.string,
	query: PropTypes.object,
	requestingDoodles: PropTypes.bool,
	requestDoodles: PropTypes.func,
};

QueryDoodles.defaultProps = {
	requestDoodles: () => {},
};

export default connect(
	( state, ownProps ) => {
		const { doodleSlug, query } = ownProps;
		return {
			requestingDoodle: isRequestingDoodle( state, doodleSlug ),
			requestingDoodles: isRequestingDoodlesForQuery( state, query ),
		};
	},
	dispatch => {
		return bindActionCreators(
			{
				requestDoodles,
				requestDoodle,
			},
			dispatch,
		);
	},
)( QueryDoodles );
