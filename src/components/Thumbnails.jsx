import React from 'react';

import Thumbnail from './Thumbnail.jsx';

import Macy from 'macy';

export default class Thumbnails extends React.Component {

	componentDidUpdate(){
		let macy = Macy({
			breakAt: {
				1030: 5,
				824: 4,
				618: 3,
				412: 2
			},
			columns: 6,
			container: '#thumbnails',
			margin: 0,
			mobileFirst: false,
			trueOrder: true,
			waitForImages: true
		});
		macy.runOnImageLoad( () => {
			macy.recalculate(true);
		}, true ); 

	}

	render() {
		const thumbnails = this.props.images.map( image => {
			return (
				<Thumbnail image={image} key={image.id} />
			);
		});
		return (
			<div id="thumbnails">
				{thumbnails}
			</div>
		);	
	}
}
