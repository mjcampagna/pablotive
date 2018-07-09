import React from 'react';

export default class Thumbnail extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClickOnImage(e) {
		e.preventDefault();
		this.props.getImage( e.target.id, this.props.toggleModal );
	}

	render() {
		return (
			<a href="#" 
				onClick={(e)=>this.handleClickOnImage(e)}
			><img 
				id={this.props.image.id} 
				src={this.props.image.urls.thumb}  
			/></a>
		);	
	}

}
