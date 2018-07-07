import React from 'react';

import Thumbnail from './Thumbnail.jsx';

import Macy from 'macy';

export default class Thumbnails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidUpdate(){
		let macy = Macy({
			breakAt: {
				992: {
					columns: 4
				},
				1024: {
					columns: 5
				}
			},
			container: '#thumbnails',
			margin: 0,
			mobileFirst: true,
			trueOrder: true
		});
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
