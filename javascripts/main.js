const contenedor = document.querySelector("#contenedor");
let select;
let juegosAlfabeticos = [];
let juegosFavoritos = [];
let requestOptions = {
	method: "GET",
	redirect: "follow",
};

fetch("./json/dbJuegos.json", requestOptions)
	.then((response) => response.json())
	.then((result) => {
		juegosAlfabeticos = result.sort();
	})
	.catch((error) => console.log("error", error));

if (localStorage.getItem("favoritos") == null) {
	localStorage.setItem("favoritos", "[]");
}

document.querySelector("#btnIndice").onclick = () => {
	resetView(), indice();
};
document.querySelector("#btnJuegos").onclick = () => {
	resetView(), renderJuegos(juegosAlfabeticos), (select = "juegos");
};
document.querySelector("#btnVerFavorito").onclick = () => {
	resetView(), renderJuegos(juntarFavoritos()), (select = "favoritos");
};

function resetView() {
	while (contenedor.hasChildNodes()) {
		contenedor.removeChild(contenedor.firstChild);
	}
}

function indice() {
	contenedor.innerHTML = `<ul id="listado" class="container tarjetaIndice"></ul>`;
	let card = document.querySelector(".tarjetaIndice");
	for (let i = 0; i < juegosAlfabeticos.length; i += 1) {
		card.innerHTML += `<li><h3 class="indice text-center ">${juegosAlfabeticos[i].nombreJuego}</h2></li>`;
	}
}

function renderJuegos(listaJuegos) {
	contenedor.innerHTML = `<ul id="listado" class="row container-fluid justify-content-center gx-0 p-0"></ul>`;
	let listado = document.querySelector("#listado");
	for (const juego of listaJuegos) {
		listado.insertAdjacentHTML(
			"beforeend",
			`<li class="card col tarjeta">
			<h2 class="titulo text-center">${juego.nombreJuego}</h2>
			<div class="contenedorImagen container-fluid d-flex align-items-center">
				<img id="${juego.id}" class="imagen img-fluid" src=${juego.imagenJuego} alt="Tapa del juego" class="card-img-top">
			</div>
      <div class="container">
        <div class="row justify-content-center align-items-center gx-0">
          <div class="col-4">
            <img class="img-fluid" src="./images/jugadores.svg" alt="cantidad de jugadores"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/edad.svg" alt="edad recomendada"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/reloj.svg" alt="tiempo minimo de juego"> 
          </div>
        </div>
        <div class="row justify-content-center align-items-center gx-0">
          <div class="col-4 text-center info">${juego.cantidadMinJugadores}-${juego.cantidadMaxJugadores}</div>
          <div class="col-4 text-center info">${juego.edadJugadores}+</div>
          <div class="col-4 text-center info">${juego.tiempoMinJuego}/${juego.tiempoMaxJuego}</div>
        </div>
      </div>
			<div>
				<a href=${juego.linkJuego} target="_blank" class="text-center btn btn-primary">Link a la BGG</a>
				<button id="${juego.id}" onclick="localStorageSet(id)" class="text-center btn btn-success">Guardar</button>
				<button id="${juego.id}" onclick="localStorageRemove(id)" class="text-center btn btn-danger">Quitar de Favoritos</button>
			</div>
		</li>`
		);
		const btn1 = document.querySelectorAll(".btn-success");
		const btn2 = document.querySelectorAll(".btn-danger");
		const btnSelector = localStorageGet();
		btn1.forEach((btn) => {
			if (btnSelector.find((favorito) => favorito == btn.id)) {
				btn.style.display = "none";
			}
		});
		btn2.forEach((btn) => {
			if (btnSelector.find((favorito) => favorito == btn.id)) {
				btn.style.display = "block";
			}
		});
	}
}

function busquedaNombre() {
	let input = document.querySelector("#inputNombre");
	let filtro = input.value.toUpperCase();
	let li = document.querySelectorAll("#listado li");
	let txtValue;
	for (i = 0; i < li.length; i += 1) {
		a = li[i].querySelectorAll("h2")[0];
		txtValue = a.textContent || a.innerText;
		txtValue.toUpperCase().indexOf(filtro) > -1
			? (li[i].style.display = "")
			: (li[i].style.display = "none");
	}
}

function busquedaCantidad() {
	let input = document.querySelector("#inputCantidadJugadores").value;
	let inputNumber = Number(input);
	let li = document.querySelectorAll("#listado li");
	for (i = 0; i < li.length; i += 1) {
		inputNumber >= juegosAlfabeticos[i].cantidadMinJugadores &&
		inputNumber <= juegosAlfabeticos[i].cantidadMaxJugadores
			? (li[i].style.display = "")
			: (li[i].style.display = "none");
	}
}

function busquedaEdad() {
	let input = document.querySelector("#inputEdad").value;
	let inputNumber = Number(input);
	let li = document.querySelectorAll("#listado li");
	for (i = 0; i < li.length; i += 1) {
		inputNumber >= juegosAlfabeticos[i].edadJugadores
			? (li[i].style.display = "")
			: (li[i].style.display = "none");
	}
}

function juntarFavoritos() {
	todosFavoritos = [];
	favoritosId = localStorageGet();
	for (const id of favoritosId) {
		todosFavoritos.push(
			juegosAlfabeticos.find((favorito) => favorito.id == id)
		);
	}
	return todosFavoritos;
}

function localStorageSet(id) {
	const nuevolocal = localStorageGet();
	if (nuevolocal.indexOf(id) !== -1) {
		Swal.fire("Error", "El juego ya esta en favoritos.", "error");
	} else {
		nuevolocal.push(id);
		localStorage.setItem("favoritos", JSON.stringify(nuevolocal));
		Swal.fire(
			"Juego guardado.",
			"Se ha guardado el juego en favorito.",
			"success"
		);
	}
	renderJuegos(juegosAlfabeticos);
}

function localStorageRemove(id) {
	const arrayId = localStorageGet();
	let index = arrayId.indexOf(id);
	if (index > -1) {
		arrayId.splice(index, 1);
		localStorage.setItem("favoritos", JSON.stringify(arrayId));
		Swal.fire("Juego removido", "El juego ya no esta en favoritos.", "warning");
		if (select == "juegos") {
			renderJuegos(juegosAlfabeticos);
			console.log(select);
		} else {
			renderJuegos(juntarFavoritos());
			console.log(select);
		}
	} else {
		Swal.fire("Error", "El juego no se encontraba en favoritos.", "error");
	}
}

function localStorageGet() {
	let juegosFavoritos = JSON.parse(localStorage.getItem("favoritos"));
	return juegosFavoritos;
}
