const jsonParser = require("express").json();
const fs = require("fs");
const filePath = './routes/artists.json';

const router = app => {	
    app.get("/artists", (request, response) => {
		console.log('\nMETHOD: GET ALL');
		
		const content = fs.readFileSync(filePath, "utf8");
		const artists = JSON.parse(content);
		
		console.log('\tGET ALL - SUCCESS!');
		console.log('\tARTISTS:')
		for (var i = 0; i < artists.length; i++) {
			let artist = artists[i];
			console.log('\t\t{');
			console.log('\t\t\t', 'ID      :', artist.id);
			console.log('\t\t\t', 'Name    :', artist.name);
			console.log('\t\t\t', 'Surname :', artist.surname);
			console.log('\t\t\t', 'Nickname:', artist.nickname);
			console.log('\t\t\t', 'Age     :', artist.age);

			if (i != artists.length - 1) {
				console.log('\t\t},');
			} else {
				console.log('\t\t}');
			}
		}
		
		response.send(artists);
    });
	
	app.get("/artists/:id", (request, response) => {
		const id = request.params.id;
		console.log('\nMETHOD: GET BY ID:', id);
		
		const content = fs.readFileSync(filePath, "utf8");
		const artists = JSON.parse(content);
		let artist = null;
		
		for (var i = 0; i < artists.length; i++) {
			if (artists[i].id == id) {
				artist = artists[i];
				break;
			}
		}
		
		if (artist) {
			console.log('\tGET SUCCESS!');
			console.log('\tARTIST:')
			console.log('\t\t{');
			console.log('\t\t\t', 'ID      :', artist.id);
			console.log('\t\t\t', 'Name    :', artist.name);
			console.log('\t\t\t', 'Surname :', artist.surname);
			console.log('\t\t\t', 'Nickname:', artist.nickname);
			console.log('\t\t\t', 'Age     :', artist.age);
			console.log('\t\t}');
			response.send(artist);
		} else {
			console.log('\tGET FAILURE - ARTIST NOT FOUND!');
			response.status(404).send();
		}
	});
	
	app.post("/artists", jsonParser, (request, response) => {
		console.log('\nMETHOD: POST');
		
		if (!request.body) {
			console.log('\tPOST FAILURE - EMPTY BODY!');
			return response.sendStatus(400);
		}
		
		const artistName = request.body.name;
		const artistSurname = request.body.surname;
		const artistNickname = request.body.nickname;
		const artistAge = request.body.age;

		console.log('\tPOST PARAMS:');
		console.log('\t\t{');
		console.log('\t\t\t', 'Name    :', artistName);
		console.log('\t\t\t', 'Surname :', artistSurname);
		console.log('\t\t\t', 'Nickname:', artistNickname);
		console.log('\t\t\t', 'Age     :', artistAge);
		console.log('\t\t}');

		let artist = { 
			name: artistName,
			surname: artistSurname,
			nickname: artistNickname,
			age: artistAge,
		};
		
		let data = fs.readFileSync(filePath, "utf8");
		let artists = JSON.parse(data);
		
		const id = Math.max.apply(Math, artists.map(function(o) { return o.id }))
		artist.id = id + 1;
		artists.push(artist);
		data = JSON.stringify(artists);
		
		console.log('\tPOST SUCCESS!');
		fs.writeFileSync(filePath, data);
		response.send(artist);
	});
	
	app.delete("/artists/:id", (request, response) => {
		const id = request.params.id;
		console.log('\nMETHOD: DELETE -> ', id);
		
		let data = fs.readFileSync(filePath, "utf8");
		let artists = JSON.parse(data);
		let index = -1;

		for (var i = 0; i < artists.length; i++){
			if (artists[i].id == id){
				index = i;
				break;
			}
		}
		
		if (index > -1){
			console.log('\tDELETE SUCCESS!');
			const artist = artists.splice(index, 1)[0];
			data = JSON.stringify(artists);
			fs.writeFileSync(filePath, data);
			response.send(artist);
		} else {
			console.log('\tDELETE FAILURE - ARTIST NOT FOUND!');
			response.status(404).send();
		}
	});

	app.put("/artists", jsonParser, (request, response) => {
		console.log('\nMETHOD: PUT');
		
		if (!request.body) {
			console.log('\tPUT FAILURE - EMPTY BODY!');
			return res.sendStatus(400);
		}
		
		const artistId = request.body.id;
		const artistName = request.body.name;
		const artistSurname = request.body.surname;
		const artistNickname = request.body.nickname;
      	const artistAge = request.body.age;

	  	console.log('\tPUT PARAMS:');
		console.log('\t\t{');
		console.log('\t\t\t', 'ID      : ', artistId);
		console.log('\t\t\t', 'Name    : ', artistName);
		console.log('\t\t\t', 'Surname : ', artistSurname);
		console.log('\t\t\t', 'Nickname: ', artistNickname);
		console.log('\t\t\t', 'Age     : ', artistAge);
		console.log('\t\t}');
		
		let data = fs.readFileSync(filePath, "utf8");
		const artists = JSON.parse(data);
		let artist;
		for (var i = 0; i < artists.length; i++){
			if (artists[i].id == artistId){
				artist = artists[i];
				break;
			}
		}

		if (artist) {
			console.log('\tPUT SUCCESS!');
			
			artist.name = artistName;
			artist.surname = artistSurname;
			artist.nickname = artistNickname;
			artist.age = artistAge;

			data = JSON.stringify(artists);
			fs.writeFileSync(filePath, data);
			response.send(artist);
		} else {
			console.log('\tPUT FAILURE - ARTIST NOT FOUND!');
			response.status(404).send(artist);
		}
	});
}

module.exports = router;