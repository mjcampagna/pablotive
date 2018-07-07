import React from 'react';

export default class Thumbnail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<img 
				src={this.props.image.urls.thumb}  
			/>
		);	
	}

}
