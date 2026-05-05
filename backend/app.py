from flask import Flask, render_template, request, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__,
            template_folder='../frontend/templates',
            static_folder='../frontend/static')

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=int(os.getenv("DB_PORT", 5432))
    )


@app.route('/')
def inicio():
    return render_template('inicio.html')


@app.route('/experiencia')
def experiencia():
    return render_template('experiencia.html')


@app.route('/proyectos')
def proyectos():
    return render_template('proyectos.html')


@app.route('/contacto')
def contacto():
    return render_template('contacto.html')


@app.route('/enviar-contacto', methods=['POST'])
def enviar_contacto():
    nombre  = request.form.get('nombre',  '').strip()
    email   = request.form.get('email',   '').strip()
    mensaje = request.form.get('mensaje', '').strip()

    if not nombre or not email or not mensaje:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Email no válido"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO contactos (nombre, email, mensaje) VALUES (%s, %s, %s)",
                (nombre, email, mensaje)
            )
        conn.commit()
        conn.close()
        return jsonify({"mensaje": "¡Mensaje enviado correctamente!"}), 200
    except Exception:
        return jsonify({"error": "Error al guardar el mensaje. Intenta más tarde."}), 500


if __name__ == '__main__':
    app.run(debug=True)