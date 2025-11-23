from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app)

TMDB_KEY = "b46df14154e0d1dc69ba9d71f7d55448"
YT_KEY = "AIzaSyBMYogNih1_E9kJj2R13OGAZ61zaOO8dms"

DB_FILE = "reviews.json"


# =====================================================
# Cargar base de datos
# =====================================================
def load_db():
    if not os.path.exists(DB_FILE):
        return {"peliculas": [], "videos": [], "documentales": []}

    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


# =====================================================
# Buscar en TMDB — con filtros reales que sí funcionan:
# - Español ("es-ES")
# - Eliminación manual de contenidos NO TP
# =====================================================
def search_tmdb(query):

    url = (
        "https://api.themoviedb.org/3/search/movie"
        f"?api_key={TMDB_KEY}"
        f"&query={query}"
        f"&language=es-ES"
        f"&include_adult=false"
    )

    res = requests.get(url).json()
    results = res.get("results", [])

    clean = []

    for movie in results:

        # Solo contenido con overview válido
        if not movie.get("overview"):
            continue

        # Obtener certificación real
        cert_url = (
            f"https://api.themoviedb.org/3/movie/{movie['id']}/release_dates"
            f"?api_key={TMDB_KEY}"
        )
        cert_data = requests.get(cert_url).json()

        is_TP = False

        for country in cert_data.get("results", []):
            if country["iso_3166_1"] == "ES":
                for rel in country["release_dates"]:
                    if rel.get("certification") in ["TP", "A", "", None]:
                        is_TP = True

        if not is_TP:
            continue  # DESCARTAR contenido no apto

        genres = movie.get("genre_ids", [])
        is_documentary = 99 in genres

        clean.append({
            "title": movie.get("title", ""),
            "cover": (
                f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                if movie.get("poster_path")
                else ""
            ),
            "description": movie.get("overview", ""),
            "is_documentary": is_documentary,
            "id": movie.get("id")
        })

    return clean


# =====================================================
# Buscar en YouTube con filtros:
# - Español
# - Seguro
# - Eliminación manual de contenido restringido
# =====================================================
def search_youtube(query):

    url = (
        "https://www.googleapis.com/youtube/v3/search"
        f"?part=snippet"
        f"&type=video"
        f"&videoSyndicated=true"
        f"&relevanceLanguage=es"
        f"&safeSearch=strict"
        f"&maxResults=10"
        f"&q={query}"
        f"&key={YT_KEY}"
    )

    res = requests.get(url).json()
    items = res.get("items", [])

    clean = []

    for v in items:
        snippet = v.get("snippet", {})
        title = snippet.get("title", "")
        desc = snippet.get("description", "")

        # FILTRO: eliminar videos de lenguaje inapropiado
        lower = f"{title.lower()} {desc.lower()}"
        prohibidas = ["18+", "violento", "sangre", "sexo", "nsfw"]
        if any(p in lower for p in prohibidas):
            continue

        # Detectar documental
        is_documentary = any(
            word in lower for word in ["documental", "documentary", "docu"]
        )

        clean.append({
            "title": title,
            "cover": snippet["thumbnails"]["high"]["url"],
            "description": desc,
            "is_documentary": is_documentary,
            "id": v["id"]["videoId"]
        })

    return clean


# =====================================================
# Endpoint unificado TMDB + YouTube
# =====================================================
@app.route("/search_all", methods=["GET"])
def search_all():
    q = request.args.get("q", "")
    return jsonify({
        "movies": search_tmdb(q),
        "youtube": search_youtube(q)
    })


# =====================================================
# Obtener reseñas
# =====================================================
@app.route("/reviews", methods=["GET"])
def get_reviews():
    return jsonify(load_db())


# =====================================================
# Agregar nueva reseña
# =====================================================
@app.route("/add_review", methods=["POST"])
def add_review():
    db = load_db()
    new = request.json

    tipo = new["tipo"]

    if tipo == "pelicula":
        db["peliculas"].append(new)
    elif tipo == "video":
        db["videos"].append(new)
    else:
        db["documentales"].append(new)

    save_db(db)

    return jsonify({"message": "Reseña guardada correctamente"})


# =====================================================
# Agregar comentario
# =====================================================
@app.route("/add_comment", methods=["POST"])
def add_comment():
    db = load_db()
    data = request.json

    title = data["titulo"]
    comment = data["comentario"]

    for section in ["peliculas", "videos", "documentales"]:
        for item in db[section]:
            if item["titulo"] == title:
                item.setdefault("comentarios", [])
                item["comentarios"].append(comment)

    save_db(db)
    return jsonify({"message": "Comentario agregado"})


# =====================================================
# Ejecutar servidor
# =====================================================
if __name__ == "__main__":
    app.run(debug=True)
