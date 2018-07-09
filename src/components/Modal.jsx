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
		this.state = {
			generated: false,
			view: 'original',

			steps: 75,
			computeSize: 512,
			viewSize: 512,
			shapes: 200,
			alpha: 0.5,
			mutations: 30,
			mutateAlpha: true,
			shapeTypes: [Triangle],
			shapeTypeTriangle: true,
			shapeTypeRectangle: false,
			shapeTypeEllipse: false,
			fill: 'auto'
		};

	}

	handleConfig(event, name) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		this.setState({
			[name]: value
		}, () => {

			var shapes = [];
			if ( this.state.shapeTypeTriangle ) shapes.push(Triangle);
			if ( this.state.shapeTypeRectangle ) shapes.push(Rectangle);
			if ( this.state.shapeTypeEllipse ) shapes.push(Ellipse);
			this.setState({
				shapeTypes: shapes
			})
		})
	}

	handleGenerate(event) {
		event.preventDefault();
		this.setState({
			generated: true,
			view: 'raster'
		}, () => {
			const src = this.props.image.urls.regular;
			const cfg = {
				steps: this.state.steps,
				computeSize: this.state.computeSize, 
				viewSize: this.state.viewSize, 
				shapes: this.state.shapes, 
				alpha: this.state.alpha,
				mutations: this.state.mutations,
				mutateAlpha: this.state.mutateAlpha,
				shapeTypes: this.state.shapeTypes,
				fill: this.state.fill
			};
			imgSrcToBlob(src, 'image/png', 'Anonymous').then( blob => {
				let url = URL.createObjectURL(blob);
				Canvas.original(url, cfg).then(original => go(original, cfg));
			})
			.catch( err => console.log('Image failed to load...', err) );	
		})
	}

	handleClickOnView(event, button) {
		event.preventDefault();
		this.setState({
			view: button
		})
	}

	render() {
		return (
			<div className="modal-opacity modal-on" id="modal">
				<div id="modal-header">
					<button id="closeBtn" 
						onClick={()=>this.props.toggleModal()}>
						Close
					</button>
					<div id="view-buttons">
						<button onClick={(e) => this.handleClickOnView(e, 'original')} style={{
							backgroundColor: this.state.view === 'original' ? 'orange' : 'transparent',
							color: this.state.view === 'original' ? 'white' : 'black',
							visibility: this.state.generated ? 'visible' : 'hidden'
						}}>
							Original
						</button>
						<button onClick={(e) => this.handleClickOnView(e, 'raster')} style={{
							backgroundColor: this.state.view === 'raster' ? 'orange' : 'transparent',
							color: this.state.view === 'raster' ? 'white' : 'black',
							visibility: this.state.generated ? 'visible' : 'hidden'
						}}>
							Raster
						</button>
						<button onClick={(e) => this.handleClickOnView(e, 'vector')} style={{
							backgroundColor: this.state.view === 'vector' ? 'orange' : 'transparent',
							color: this.state.view === 'vector' ? 'white' : 'black',
							visibility: this.state.generated ? 'visible' : 'hidden'
						}}>
							Vector
						</button>
					</div>
				</div>

				<div id="modal-body">
					<div id="modal-stage">
						<div id="output">
							<div className="original" id="original" style={{ display: this.state.view === 'original' ? 'block' : 'none'}}>
								<img src={this.props.image.urls.regular} crossOrigin="anonymous" />
							</div>
							<div className="raster" id="raster" style={{ display: this.state.view === 'raster' ? 'block' : 'none'}}></div>
							<div className="vector" id="vector" style={{ display: this.state.view === 'vector' ? 'block' : 'none'}}></div>
						</div>
					</div>

					<div id="modal-config">

						<form id="primitivConfig" onSubmit={(e) => this.handleGenerate(e)}>

							<label>Number of Shapes <span className="slider-value">{this.state.steps}</span></label>
							<legend>speed v. quality</legend>
							<input type="range" name="steps" min="1" max="500" value={this.state.steps} onChange={(e) => this.handleConfig(e, 'steps')} />

							<fieldset>
								<label>
									<input type="checkbox" name="shapeType" value="triangle" checked={this.state.shapeTypeTriangle} onChange={(e) => this.handleConfig(e, 'shapeTypeTriangle')} />
									Triangles
								</label>
								<label>
									<input type="checkbox" name="shapeType" value="rectangle" checked={this.state.shapeTypeRectangle} onChange={(e) => this.handleConfig(e, 'shapeTypeRectangle')} />
									Rectangles
								</label>
								<label>
									<input type="checkbox" name="shapeType" value="ellipse" checked={this.state.shapeTypeEllipse} onChange={(e) => this.handleConfig(e, 'shapeTypeEllipse')} />
									Ellipses
								</label>
							</fieldset>

							<label>Computation Size <span className="slider-value">{this.state.computeSize}</span></label>
							<legend>speed v. quality</legend>
							<input type="range" name="computeSize" min="128" max="2048" value={this.state.computeSize} onChange={(e) => this.handleConfig(e, 'computeSize')} />

							<label>Mutations <span className="slider-value">{this.state.mutations}</span></label>
							<legend>speed v. quality</legend>
							<input type="range" name="mutations" min="0" max="100" value={this.state.mutations} onChange={(e) => this.handleConfig(e, 'mutations')} />

							<label>Precision <span className="slider-value">{this.state.shapes}</span></label>
							<legend>speed v. precision</legend>
							<input type="range" name="shapes" min="1" max="1000" value={this.state.shapes} onChange={(e) => this.handleConfig(e, 'shapes')} />

							<label>Viewing Size <span className="slider-value">{this.state.viewSize}</span></label>
							<input type="range" name="viewSize" min="256" max="2048" value={this.state.viewSize} onChange={(e) => this.handleConfig(e, 'viewSize')} />

							{/* <label>Alpha <span className="slider-value">{this.state.alpha}</span></label>
							<legend>Opacity</legend>
							<input type="range" name="alpha" min="0" max="1" step="0.1" value={this.state.alpha} onChange={(e) => this.handleConfig(e, 'alpha')} />
							<label>
								<input type="checkbox" name="mutateAlpha" checked="checked" />
								Adjust opacity automatically
							</label> */}

							<button type="submit" id="generate">Generate</button>
						</form>

						<p><span id="steps">&nbsp;</span></p>
						<label class="info" htmlFor="vector-text">Copy the SVG Source</label>
						<div id="vector-source">
							<input type="text" className="vector" id="vector-text"></input>
						</div>
						<p class="info">Or select "Raster", right-click and Save.</p>
					</div>

				</div>

				<div id="modal-footer">
					<p>by {this.props.image.user.name}</p>
				</div>
			</div>
		);	
	}

	componentDidMount() {
		window.nodes = nodes();
	}
}
