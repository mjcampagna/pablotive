import React from 'react';

export default class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: ''
		};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			query: e.target.value
		})
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.search(this.state.query);
		this.setState({
			query: ''
		})
	}

	render() {
		return (
			<form id="search" onSubmit={this.handleSubmit}>
				<input type="text" 
					value={this.state.query} 
					onChange={this.handleChange} 
				/>
				<button type="submit">Find</button>
			</form>
		);	
	}

}
