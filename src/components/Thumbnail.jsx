import React from 'react';

export default class Thumbnail extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClickOnImage(e) {
		e.preventDefault();
	}

	render() {
		return (
			<a href="#" 
				onClick={(e)=>this.handleClickOnImage(e)}
			><img 
				src={this.props.image.urls.thumb}  
			/></a>
		);	
	}

}
