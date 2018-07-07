import React from 'react';

import Thumbnails from './Thumbnails.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [],
			total: 0,
			total_pages: 0
		}
	}

	componentDidMount() {
		fetch('/unsplash')
		.then( res => res.json() )
		.then( json => {
			this.setState({
				results: json.results,
				total: json.total,
				total_pages: json.total_pages
			})
		})
	}

	render() {
		return (
			<React.Fragment>
				<Thumbnails images={this.state.results} />
			</React.Fragment>
		);	
	}
}
