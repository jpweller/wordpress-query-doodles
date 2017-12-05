WordPress Query Doodles
=======================

This package contains a query component, along with redux state & selectors for doodles pulled from a WordPress site. This uses the [`node-wpapi`](https://github.com/WP-API/node-wpapi) package to get your site's data via Query Components ([inspired by calypso](https://github.com/Automattic/wp-calypso/blob/master/docs/our-approach-to-data.md#query-components)). The Query Components call the API, which via actions set your site's data into the state.

To use any of these helpers, you'll need to set your Site URL in a global (`SiteSettings`), so that the API knows what site to connect to. For example:

```js
window.SiteSettings = {
	endpoint: 'url.com/path-to-wordpress',
};
```

As of version 1.1, the URL should _not_ include `/wp_json` – `wordpress-rest-api-oauth-1` adds that for us.

Query Doodles
===========

Query Doodles is a React component used in managing the fetching of doodles queries, or single doodles by the doodle slug.

## Usage

Used to request a single doodle, or list of doodles, based on either a query object, or doodle slug.

Render the component, passing in the `query` or a single `doodleSlug`. It does not accept any children, nor does it render any elements to the page. You can use it adjacent to other sibling components which make use of the fetched data made available through the global application state.

```jsx
import React from 'react';
import QueryDoodles from 'wordpress-query-doodles';
import MyDoodlesListItem from './list-item';

export default function MyDoodlesList( { doodles } ) {
	return (
		<div>
			<QueryDoodles query={ { search: 'Themes' } } />
			{ doodles.map( ( doodle ) => {
				return (
					<MyDoodlesListItem
						key={ doodle.id }
						doodle={ doodle } />
				);
			} }
		</div>
	);
}
```

or for a single doodle:

```jsx
import React from 'react';
import QueryDoodles from 'wordpress-query-doodles';
import SingleDoodle from './single';

export default function MyDoodlesList( { doodle } ) {
	return (
		<div>
			<QueryDoodles doodleSlug="local-development-for-wordcamp-websites" />
			<SingleDoodle doodle={ doodle } />
		</div>
	);
}
```

## Props

### `query`

<table>
	<tr><th>Type</th><td>Object</td></tr>
	<tr><th>Required</th><td>No</td></tr>
	<tr><th>Default</th><td><code>null</code></td></tr>
</table>

The query to be used in requesting doodles.

### `doodleSlug`

<table>
	<tr><th>Type</th><td>String</td></tr>
	<tr><th>Required</th><td>No</td></tr>
	<tr><th>Default</th><td><code>null</code></td></tr>
</table>

The doodle slug of the doodle to request.

Doodle Selectors
==============

You can import these into your project by grabbing them from the `selectors` file:

```jsx
import { getDoodle, isRequestingDoodle } from 'wordpress-query-doodles/lib/selectors';
```

#### `getDoodle( state, globalId )`

#### `getDoodlesForQuery( state, query )`

#### `isRequestingDoodlesForQuery( state, query )`

#### `getTotalPagesForQuery( state, query )`

#### `isRequestingDoodle( state, doodleSlug )`

#### `getDoodleIdFromSlug( state, slug )`

Doodle State
==========

If you need access to the reducers, action types, or action creators, you can import these from the `state` file. For example, to use this in your global redux state, mix it into your reducer tree like this:

```jsx
import doodles from 'wordpress-query-doodles/lib/state';

let reducer = combineReducers( { ...otherReducers, doodles } );
```

If you need to call an action (the query component should take care of this most of the time), you can pull the action out specifically:

```jsx
import { requestDoodle } from 'wordpress-query-doodles/lib/state';
```

[View the file itself](src/state.js) to see what else is available.
