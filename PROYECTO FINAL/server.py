from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde frontend

REVIEWS_FILE = "reviews.json"

# ----------------------------------------
# Cargar JSON
# ----------------------------------------
def load_reviews():
    with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# ----------------------------------------
# Guardar JSON
# ----------------------------------------
def save_reviews(data):
    with open(REVIEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ----------------------------------------
# OBTENER RESEÑAS
# ----------------------------------------
@app.route("/reviews", methods=["GET"])
def get_reviews():
    data = load_reviews()
    return jsonify(data)

# ----------------------------------------
# AÑADIR NUEVA RESEÑA
# ----------------------------------------
@app.route("/add_review", methods=["POST"])
def add_review():
    data = load_reviews()
    new_review = request.json

    entry = {
        "titulo": new_review["titulo"],
        "cover": new_review["cover"],
        "resena": new_review["resena"],
        "comentarios": []
    }

    # Por simplicidad, todas van en "peliculas"
    data["peliculas"].append(entry)

    save_reviews(data)

    return jsonify({"message": "Reseña guardada correctamente"})

# ----------------------------------------
# AGREGAR COMENTARIO
# ----------------------------------------
@app.route("/add_comment", methods=["POST"])
def add_comment():
    data = load_reviews()
    payload = request.json

    titulo = payload["titulo"]
    comentario = payload["comentario"]

    updated = False

    for categoria in ["peliculas", "videos", "documentales"]:
        for item in data[categoria]:
            if item["titulo"] == titulo:
                item["comentarios"].append(comentario)
                updated = True

    if updated:
        save_reviews(data)
        return jsonify({"message": "Comentario agregado"})
    else:
        return jsonify({"message": "No se encontró el título"}), 404

# ----------------------------------------
# INICIO DEL SERVIDOR
# ----------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
