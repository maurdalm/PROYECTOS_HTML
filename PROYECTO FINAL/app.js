// ============================================
// CONFIGURACIÓN TMDB
// ============================================
const API_KEY = "b46df14154e0d1dc69ba9d71f7d55448";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ============================================
// CARGAR DATOS DESDE BACKEND PYTHON
// ============================================
async function loadReviews() {
    const response = await fetch("http://localhost:5000/reviews");
    const data = await response.json();
    return data;
}

// ============================================
// MOSTRAR CONTENIDO EN LA PÁGINA PRINCIPAL
// ============================================
document.addEventListener("DOMContentLoaded", async () => {

    // Si la página NO tiene contenedores (por ejemplo estás en add-review.html), salir
    if (!document.querySelector(".item-list")) return;

    const reviews = await loadReviews();

    displayCategory(reviews.peliculas, "movieList");
    displayCategory(reviews.videos, "videoList");
    displayCategory(reviews.documentales, "documentaryList");
});

// ============================================
// RENDERIZAR CATEGORÍAS
// ============================================
function displayCategory(items, elementID) {
    const container = document.getElementById(elementID);
    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";

        const coverURL = item.cover.includes("http")
            ? item.cover
            : IMG_URL + item.cover;

        div.innerHTML = `
            <img src="${coverURL}" alt="${item.titulo}" />
            <div class="info">
                <h3>${item.titulo}</h3>
                <p>${item.resena}</p>

                <div class="comments">
                    <h4>Comentarios</h4>
                    <ul>
                        ${item.comentarios.map(c => `<li>${c}</li>`).join("")}
                    </ul>
                    <input type="text" placeholder="Agregar comentario" 
                        onkeypress="addComment(event, '${item.titulo}')"/>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}

// ============================================
// BUSCADOR
// ============================================
function searchReview() {
    const text = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".item");

    items.forEach(item => {
        const title = item.querySelector("h3").textContent.toLowerCase();
        item.style.display = title.includes(text) ? "flex" : "none";
    });
}

// ============================================
// AGREGAR COMENTARIO
// ============================================
async function addComment(event, title) {
    if (event.key !== "Enter") return;

    const comment = event.target.value;
    event.target.value = "";

    const response = await fetch("http://localhost:5000/add_comment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ titulo: title, comentario: comment })
    });

    const result = await response.json();
    alert(result.message);
    location.reload();
}

// ============================================
// TMDB: BUSCAR PELÍCULAS
// ============================================
async function searchMovieTMDB(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// ============================================
// BUSCADOR EN add-review.html
// ============================================
async function searchInDB() {
    const text = document.getElementById("searchDB").value;

    if (text.length < 2) return;

    const results = await searchMovieTMDB(text);

    const list = document.getElementById("searchResults");
    list.innerHTML = "";

    results.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.onclick = () => selectItemFromTMDB(movie);
        list.appendChild(li);
    });
}

let selectedMovie = null;

function selectItemFromTMDB(movie) {
    selectedMovie = movie;
    alert("Seleccionado: " + movie.title);
}

// ============================================
// GUARDAR NUEVA RESEÑA EN PYTHON
// ============================================
async function saveReview() {
    const text = document.getElementById("reviewText").value;

    if (!selectedMovie || !text) {
        alert("Selecciona una película y escribe la reseña.");
        return;
    }

    const data = {
        titulo: selectedMovie.title,
        cover: selectedMovie.poster_path,
        resena: text
    };

    const response = await fetch("http://localhost:5000/add_review", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
    window.location.href = "index.html";
}
