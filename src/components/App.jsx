import React from 'react';

import Search from './Search.jsx';
import Thumbnails from './Thumbnails.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: 'latest',
			results: []
		}
		this.queryUnsplash = this.queryUnsplash.bind(this);
	}

	queryUnsplash(query) {
		fetch('/unsplash/search/' + query)
		.then( res => res.json() )
		.then( json => {
			this.setState({
				query: query,
				results: json
			})
		})
	}

	componentDidMount() {
		fetch('/unsplash/latest')
		.then( res => res.json() )
		.then( json => {
			this.setState({
				results: json
			})
		})
	}

	render() {
		return (
			<React.Fragment>
				<header>
					<h1>{this.state.query}</h1>
					<Search search={this.queryUnsplash} />
				</header>
				<Thumbnails images={this.state.results} />
			</React.Fragment>
		);	
	}
}
