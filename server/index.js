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

app.get('/unsplash/latest', ( req, res ) => {
	unsplash.photos.listCuratedPhotos(1, 25, 'latest')
	.then(Unsplash.toJson)
	.then(json => {
		res.status(200).send(json);
	});
});

app.get('/unsplash/image/:id', ( req, res ) => {
	unsplash.photos.getPhoto(req.params.id)
	.then(Unsplash.toJson)
	.then(json => {
		console.log(json);
		res.status(200).send(json);
	});
});

app.get('/unsplash/search/:query', ( req, res ) => {
	unsplash.search.photos(req.params.query, 1, 25)
	.then(Unsplash.toJson)
	.then(json => {
		res.status(200).send(json.results);
	});
});

const port = process.env.PORT || 1337;
app.listen(port, console.log(
	`Listening on port ${port}...`
));
