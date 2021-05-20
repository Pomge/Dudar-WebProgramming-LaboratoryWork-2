async function GetArtists() {
	const response = await fetch("/artists", {
		method: "GET",
		headers: { "Accept": "application/json" }
	});

	if (response.ok === true) {
		const artists = await response.json();
		let rows = document.querySelector("tbody"); 
		artists.forEach(artist => {
			rows.append(row(artist));
		});
	}
}

async function GetArtist(id) {
	const response = await fetch("/artists/" + id, {
		method: "GET",
		headers: { "Accept": "application/json" }
	});

	if (response.ok === true) {
		const artist = await response.json();
		const form = document.forms["artistForm"];
		form.elements["id"].value = artist.id;
		form.elements["name"].value = artist.name;
		form.elements["surname"].value = artist.surname;
		form.elements["nickname"].value = artist.nickname;
		form.elements["age"].value = artist.age;
	}
}

async function CreateArtist(artistName, artistSurname, artistNickname, artistAge) {
	const response = await fetch("artists", {
		method: "POST",
		headers: { "Accept": "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({
			name: artistName,
			surname: artistSurname,
			nickname: artistNickname,
			age: parseInt(artistAge, 10)
		})
	});

	if (response.ok === true) {
		const artist = await response.json();
		reset();
		document.querySelector("tbody").append(row(artist));
	}
}

async function EditArtist(artistId, artistName, artistSurname, artistNickname, artistAge) {
	const response = await fetch("artists", {
		method: "PUT",
		headers: { "Accept": "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({
			id: artistId,
			name: artistName,
			surname: artistSurname,
			nickname: artistNickname,
			age: parseInt(artistAge, 10)
		})
	});

	if (response.ok === true) {
		const artist = await response.json();
		reset();
		document.querySelector("tr[data-rowid='" + artist.id + "']").replaceWith(row(artist));
	}
}

async function DeleteArtist(id) {
	const response = await fetch("artists/" + id, {
		method: "DELETE",
		headers: { "Accept": "application/json" }
	});

	if (response.ok === true) {
		const artist = await response.json();
		document.querySelector("tr[data-rowid='" + artist.id + "']").remove();
	}
}


function reset() {
	const form = document.forms["artistForm"];
	form.reset();
	form.elements["id"].value = 0;
}

function row(artist) {
	const tr = document.createElement("tr");
	tr.setAttribute("data-rowid", artist.id);

	const idTd = document.createElement("td");
	idTd.append(artist.id);
	tr.append(idTd);

	const nameTd = document.createElement("td");
	nameTd.append(artist.name);
	tr.append(nameTd);
	
	const surnameTd = document.createElement("td");
	surnameTd.append(artist.surname);
	tr.append(surnameTd);

	const nicknameTd = document.createElement("td");
	nicknameTd.append(artist.nickname);
	tr.append(nicknameTd);

	const ageTd = document.createElement("td");
	ageTd.append(artist.age);
	tr.append(ageTd);
		  
	const linksTd = document.createElement("td");

	const editLink = document.createElement("a");
	editLink.setAttribute("data-id", artist.id);
	editLink.setAttribute("style", "cursor:pointer;padding:15px;");
	editLink.append("Изменить");
	editLink.addEventListener("click", e => {
		e.preventDefault();
		GetArtist(artist.id);
	});

	const removeLink = document.createElement("a");
	removeLink.setAttribute("data-id", artist.id);
	removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
	removeLink.append("Удалить");
	removeLink.addEventListener("click", e => {
		e.preventDefault();
		DeleteArtist(artist.id);
	});

	linksTd.append(editLink);
	linksTd.append(removeLink);
	tr.appendChild(linksTd);

	return tr;
}

document.getElementById("reset").click(function (e) {
	e.preventDefault();
	reset();
})


document.forms["artistForm"].addEventListener("submit", e => {
	e.preventDefault();
	const form = document.forms["artistForm"];
	const id = form.elements["id"].value;
	const name = form.elements["name"].value;
	const surname = form.elements["surname"].value;
	const nickname = form.elements["nickname"].value;
	const age = form.elements["age"].value;
		
	if (id == 0) {
		CreateArtist(name, surname, nickname, age);
	} else {
		EditArtist(id, name, surname, nickname, age);
	}
});

GetArtists();