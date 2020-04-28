import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

import sqlite3
from helpers import lookup

from dotenv import load_dotenv
load_dotenv()

# configure application
app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

@app.route("/")
def index():
    """Render map."""
    # if not os.environ.get("API_KEY"):
    #     raise RuntimeError("API_KEY not set")
    return render_template("index.html", key=os.environ.get("API_KEY"))

@app.route("/articles")
def articles():
    """Look up articles for geo."""
     
    geo = request.args.get("geo")

    if not geo:
        raise RuntimeError("missing geo")
    
    articles = lookup(geo)
        
    if len(articles) > 5:
        return jsonify([articles[0], articles[1], articles[2], articles[3], articles[4]])
    else:
        return jsonify(articles)

@app.route("/search")
def search():
    """Search for places that match query."""
    database_connection = sqlite3.connect('./database/mashup.db')
    db = database_connection.cursor()
    
    q = request.args.get("q") + "%"

    cities = db.execute("SELECT * FROM places WHERE postal_code LIKE :q OR place LIKE :q OR voivodeship LIKE :q", dict(q=q))
    
    return jsonify(list(cities))
    
@app.route("/update")
def update():
    """Find up to 10 places within view."""

    database_connection = sqlite3.connect('./database/mashup.db')
    db = database_connection.cursor()

    # ensure parameters are present
    if not request.args.get("sw"):
        raise RuntimeError("missing sw")
    if not request.args.get("ne"):
        raise RuntimeError("missing ne")

    # ensure parameters are in lat,lng format
    if not re.search("^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$", request.args.get("sw")):
        raise RuntimeError("invalid sw")
    if not re.search("^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$", request.args.get("ne")):
        raise RuntimeError("invalid ne")

    # explode southwest corner into two variables
    (sw_lat, sw_lng) = [float(s) for s in request.args.get("sw").split(",")]

    # explode northeast corner into two variables
    (ne_lat, ne_lng) = [float(s) for s in request.args.get("ne").split(",")]

    # find 10 cities within view, pseudorandomly chosen if more within view
    if (sw_lng <= ne_lng):

        # doesn't cross the antimeridian
        rows = db.execute("""SELECT * FROM places
            WHERE :sw_lat <= latitude AND latitude <= :ne_lat AND (:sw_lng <= longitude AND longitude <= :ne_lng)
            GROUP BY country_code, place, voivodeship
            ORDER BY RANDOM()
            LIMIT 10""",
            dict(sw_lat=sw_lat, ne_lat=ne_lat, sw_lng=sw_lng, ne_lng=ne_lng))

    else:

        # crosses the antimeridian
        rows = db.execute("""SELECT * FROM places
            WHERE :sw_lat <= latitude AND latitude <= :ne_lat AND (:sw_lng <= longitude OR longitude <= :ne_lng)
            GROUP BY country_code, place, voivodeship
            ORDER BY RANDOM()
            LIMIT 10""",
            dict(sw_lat=sw_lat, ne_lat=ne_lat, sw_lng=sw_lng, ne_lng=ne_lng))

    # output places as JSON
    return jsonify(list(rows))

if __name__ == "__main__":
    app.run(port=8080)