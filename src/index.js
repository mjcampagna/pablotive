import normalize from 'normalize.css';
import css from './style.css';

import { imgSrcToBlob } from 'blob-util';

import Canvas from "./primitive/canvas.js";
import {Triangle, Rectangle, Ellipse} from "./primitive/shape.js";
import Optimizer from "./primitive/optimizer.js";

import React from 'react';
import ReactDOM from 'react-dom';

// import { createStore } from 'redux';

import App from './components/App.jsx';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
