import React from 'react';

import Pablo from './Pablo.jsx';
import Search from './Search.jsx';
import Thumbnails from './Thumbnails.jsx';
import Modal from './Modal.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: null,
			imageId: null,
			modal: false,
			query: 'latest',
			results: []
		}
		this.getImage = this.getImage.bind(this);
		this.searchUnsplash = this.searchUnsplash.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
	}

	getImage(id, callback) {
		fetch('/unsplash/image/' + id)
		.then( res => res.json() )
		.then( json => {
			this.setState({
				image: json
			}, () => {
				callback();
			})
		})
	}

	searchUnsplash(query) {
		fetch('/unsplash/search/' + query)
		.then( res => res.json() )
		.then( json => {
			this.setState({
				query: query,
				results: json
			})
		})
	}

	toggleModal() {
		document.body.classList.toggle('overflow-hidden');
		this.setState({
			modal: !this.state.modal
		})
	}

	render() {
		return (
			<React.Fragment>

				<header>
					<Pablo />
					<h1>Pablotive</h1>
					<Search search={this.searchUnsplash} />
				</header>

				<h2>{this.state.query}</h2>

				<Thumbnails images={this.state.results} getImage={this.getImage} toggleModal={this.toggleModal} />

				{this.state.modal && 
					<Modal className="modal-opacity modal-on" image={this.state.image} toggleModal={this.toggleModal} />
				}

			</React.Fragment>
		);	
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

}


// {this.state.modal && 
// 	<CSSTransition
// 		timeout={300} 
// 		classNames='fade'
// 	>
// 		<Modal key="modal" image={this.state.image} toggleModal={this.toggleModal} />
// 	</CSSTransition>
// }