import React from 'react';

import { imgSrcToBlob } from 'blob-util';
import Canvas from "../primitive/canvas.js";
import {Triangle, Rectangle, Ellipse} from "../primitive/shape.js";
import Optimizer from "../primitive/optimizer.js";

let nodes = () => {
	let nodes = {
		output: document.querySelector("#output"),
		original: document.querySelector("#original"),
		steps: document.querySelector("#steps"),
		raster: document.querySelector("#raster"),
		vector: document.querySelector("#vector"),
		vectorText: document.querySelector("#vector-text"),
		types: Array.from(document.querySelectorAll("#output [name=type]"))
	}
	return nodes;
}

let steps;

function go(original, cfg) {

	const nodes = window.nodes;

	nodes.steps.innerHTML = '';
  nodes.original.innerHTML = '';
  nodes.raster.innerHTML = '';
  nodes.vector.innerHTML = '';
  nodes.vectorText.value = '';

  nodes.output.style.display = '';
  nodes.original.appendChild(original.node);

  let optimizer = new Optimizer(original, cfg);
  steps = 0;

  let cfg2 = Object.assign({}, cfg, {width:cfg.scale*cfg.width, height:cfg.scale*cfg.height});
  let result = Canvas.empty(cfg2, false);
  result.ctx.scale(cfg.scale, cfg.scale);
  nodes.raster.appendChild(result.node);

  let svg = Canvas.empty(cfg, true);
  svg.setAttribute("width", cfg2.width);
  svg.setAttribute("height", cfg2.height);
  nodes.vector.appendChild(svg);

  let serializer = new XMLSerializer();

  optimizer.onStep = (step) => {
    if (step) {
      result.drawStep(step);
      svg.appendChild(step.toSVG());
      let percent = (100*(1-step.distance)).toFixed(2);
      nodes.vectorText.value = serializer.serializeToString(svg);
      nodes.steps.innerHTML = `(${++steps} of ${cfg.steps}, ${percent}% similar)`;
    }
  };
  optimizer.start();

}

export default class Modal extends React.Component {
	constructor(props) {
		super(props);

		this.cfg = {
			steps: 75,
			computeSize: 256, 
			viewSize: 512, 
			shapes: 200, 
			alpha: 0.5,
			mutations: 30,
			mutateAlpha: true,
			shapeTypes: [Triangle],
			fill: 'auto'
		};

	}

	handleGenerate(event) {
		event.preventDefault();
		const src = this.props.image.urls.regular;
		const cfg = this.cfg;
		imgSrcToBlob(src, 'image/png', 'Anonymous').then( blob => {
      let url = URL.createObjectURL(blob);
      Canvas.original(url, cfg).then(original => go(original, cfg));
    })
    .catch( err => console.log('Image failed to load...', err) );
	}

	render() {
		return (
			<div className="modal-opacity modal-on" id="modal">

				<div id="modal-header">
					<button id="closeBtn" onClick={()=>this.props.toggleModal()}>Close</button>
				</div>

				<div id="modal-body">

					<div id="modal-stage">
						<img crossOrigin="anonymous" src={this.props.image.urls.regular} />

						<div id="output">
						<h3>Original</h3>
						<div id="original"></div>
						</div>
						<div>
						<h3>Result <span id="steps"></span></h3>
						<div className="raster" id="raster" checked="checked"></div>
						<div className="vector" id="vector"></div>
						<label>
						<input type="radio" name="type" value="raster" />
						Raster image: right-click to save
						</label>
						<br/>
						<label>
						<input type="radio" name="type" value="vector" />
						Vector image: copy&amp;paste data from the text area below
						</label>
						<br/>
						<textarea className="vector" id="vector-text" spellCheck="false"></textarea>
						</div>

					</div>

					<div id="modal-config">
						<button onClick={(e) => this.handleGenerate(e)}>Generate</button>
					</div>

				</div>

				<div id="modal-footer">
					<p>...</p>
				</div>
			</div>
		);	
	}

	componentDidMount() {
		window.nodes = nodes();
	}
}

// modal(image) {
// 	const modal = document.getElementById('modal');
// 	modal.classList.toggle('modal-opacity');
// 	setTimeout( (modal) => {
// 		modal.classList.toggle('modal-on');
// 	}, 400, modal );
// }
