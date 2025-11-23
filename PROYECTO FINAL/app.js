// ============================================
// CONFIGURACIÓN TMDB
// ============================================
const API_KEY = "b46df14154e0d1dc69ba9d71f7d55448";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// CACHE PARA REDUCIR PETICIONES
const searchCache = {};

// DEBOUNCE PARA REDUCIR CONSULTAS
let debounceTimer = null;

// ============================================
// CARGAR DATOS DESDE BACKEND PYTHON
// ============================================
async function loadReviews() {
    const response = await fetch("http://localhost:5000/reviews");
    return await response.json();
}

// ============================================
// CARGA DE LA PÁGINA PRINCIPAL
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
    if (!document.querySelector(".item-list")) return;

    const reviews = await loadReviews();

    displayCategory(reviews.peliculas, "movieList");
    displayCategory(reviews.videos, "videoList");
    displayCategory(reviews.documentales, "documentaryList");
});

// ============================================
// RENDERIZAR CATEGORÍAS EN index.html
// ============================================
function displayCategory(items, elementID) {
    const container = document.getElementById(elementID);
    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <img src="${item.cover}" alt="${item.titulo}" />
            <div class="info">
                <h3>${item.titulo}</h3>
                <h4>Sipnosis</h4>
                <p>${item.description}</p>
                <h4>Reseña</h4>
                <p>${item.resena}</p>

                <!--
                <h4>Comentarios</h4>
                <ul>${(item.comentarios || []).map(c => `<li>${c}</li>`).join("")}</ul>

                <input type="text" placeholder="Agregar comentario"
                    onkeypress="addComment(event, '${item.titulo}')">
                -->
            </div>
        `;

        container.appendChild(div);
    });
}

// ============================================
// BUSCADOR EN index.html
// ============================================
function searchReview() {
    const text = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".item").forEach(item => {
        const title = item.querySelector("h3").textContent.toLowerCase();
        item.style.display = title.includes(text) ? "flex" : "none";
    });
}

// ============================================
// AGREGAR COMENTARIO
// ============================================
async function addComment(event, title) {
    if (event.key !== "Enter") return;

    const comment = event.target.value.trim();
    if (!comment) return;

    event.target.value = "";

    await fetch("http://localhost:5000/add_comment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ titulo: title, comentario: comment })
    });

    location.reload();
}

// ============================================
// BUSCADOR EN add-review.html (OPTIMIZADO)
// ============================================
let selectedItem = null;

function searchInDB() {
    const text = document.getElementById("searchDB").value.trim();
    const list = document.getElementById("searchResults");

    // Si no hay texto → limpiar resultados
    if (text.length === 0) {
        list.innerHTML = "";
        return;
    }

    // Permite cambiar elección si se vuelve a escribir
    if (selectedItem) {
        selectedItem = null;
        document.getElementById("selectedItemBox").innerHTML = "";
    }

    // Necesita mínimo 3 letras
    if (text.length < 3) {
        list.innerHTML = "";
        return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(text), 400);
}

async function performSearch(text) {
    if (searchCache[text]) {
        return displayResults(searchCache[text]);
    }

    const response = await fetch(
        `http://localhost:5000/search_all?q=${encodeURIComponent(text)}`
    );

    const data = await response.json();

    searchCache[text] = data;
    displayResults(data);
}

function displayResults(data) {
    const list = document.getElementById("searchResults");
    list.innerHTML = "";

    // TMDB
    (data.movies || []).forEach(movie => {
        const label = movie.is_documentary ? "🎥 Documental" : "🎬 Película";

        const li = document.createElement("li");
        li.className = "search-item";

        li.innerHTML = `
            <img src="${movie.cover}" class="thumb">
            <div>
                <strong>${label} — ${movie.title}</strong><br>
                <small>${movie.description}</small>
            </div>
        `;

        li.onclick = () => selectItem({
            tipo: movie.is_documentary ? "documental" : "pelicula",
            titulo: movie.title,
            cover: movie.cover,
            description: movie.description,
            id: movie.id
        });

        list.appendChild(li);
    });

    // YouTube
    (data.youtube || []).forEach(video => {
        const label = video.is_documentary ? "🎥 Documental" : "📺 Video";

        const li = document.createElement("li");
        li.className = "search-item";

        li.innerHTML = `
            <img src="${video.cover}" class="thumb">
            <div>
                <strong>${label} — ${video.title}</strong><br>
                <small>${video.description}</small>
            </div>
        `;

        li.onclick = () => selectItem({
            tipo: video.is_documentary ? "documental" : "video",
            titulo: video.title,
            cover: video.cover,
            description: video.description,
            id: video.id
        });

        list.appendChild(li);
    });
}

// ============================================
// MOSTRAR ELECCIÓN FINAL EN add-review.html
// ============================================
function selectItem(item) {
    selectedItem = item;

    // Ocultar resultados
    document.getElementById("searchResults").innerHTML = "";

    // Limpiar barra de búsqueda
    document.getElementById("searchDB").value = "";

    // Mostrar selección
    document.getElementById("selectedItemBox").innerHTML = `
        <div class="selected-item">
            <img src="${item.cover}" class="selected-cover">
            <div>
                <h2>${item.titulo}</h2>
                <p>${item.description}</p>
            </div>
        </div>
    `;
}

// ============================================
// GUARDAR RESEÑA
// ============================================
async function saveReview() {
    const text = document.getElementById("reviewText").value.trim();

    if (!selectedItem) {
        alert("Debes seleccionar un elemento antes de guardar.");
        return;
    }

    if (!text) {
        alert("Escribe una reseña antes de guardar.");
        return;
    }

    const data = {
        tipo: selectedItem.tipo,
        titulo: selectedItem.titulo,
        cover: selectedItem.cover,
        resena: text,
        description: selectedItem.description,
        comentarios: []
    };

    await fetch("http://localhost:5000/add_review", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    window.location.href = "index.html";
}
