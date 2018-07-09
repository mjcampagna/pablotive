import React from 'react';

export default class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="modal-opacity modal-on" id="modal">

				<div id="modal-header">
					<button id="closeBtn" onClick={()=>this.props.toggleModal()}>Close</button>
				</div>

				<div id="modal-body">

					<div id="modal-stage">
						<img src={this.props.image.urls.regular} />
					</div>

					<div id="modal-config">
						<p>...</p>
					</div>

				</div>

				<div id="modal-footer">
					<p>...</p>
				</div>
			</div>
		);	
	}

}

// modal(image) {
// 	const modal = document.getElementById('modal');
// 	modal.classList.toggle('modal-opacity');
// 	setTimeout( (modal) => {
// 		modal.classList.toggle('modal-on');
// 	}, 400, modal );
// }
