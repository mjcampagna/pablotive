import React from 'react';

import Thumbnail from './Thumbnail.jsx';

export default class Thumbnails extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const thumbnails = this.props.images.map( image => {
			return (
				<Thumbnail image={image} key={image.id} />
			);
		});
		return (
			<React.Fragment>
				{thumbnails}
			</React.Fragment>
		);	
	}
}
