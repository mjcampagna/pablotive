const path = require('path');

const express = require('express');
const app = express();

app.use( express.static( path.resolve(__dirname, '../dist') ) );

require('es6-promise').polyfill();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js');
const unsplash = new Unsplash.default({
  applicationId: "4368271d97958f949ba4d4cb4d01cea685fc7443bf2b8663da2f043f9bbcc106",
  secret: "82e34eae22dde93272cd627656e8780acb56efd6de20efc41ffce644c6705f24"
});

app.get('/unsplash', ( req, res ) => {
	unsplash.search.photos('ocean', 1)
	.then(Unsplash.toJson)
	.then(json => {
		res.status(200).send(json);
	});
});

const port = 1337;
app.listen(port, console.log(
	`Listening on port ${port}...`
));
