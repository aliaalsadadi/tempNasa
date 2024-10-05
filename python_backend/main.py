from astroquery.gaia import Gaia
from astropy.coordinates import SkyCoord
import astropy.units as u
from fastapi import FastAPI
from pydantic import BaseModel
from astro import get_planets, get_stars as query_stars  # Renaming imported function
from astro import getPlanetByQuery
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define a data model for input
class StarQuery(BaseModel):
    ra: float
    dec: float


# Rename the route handler
@app.post("/getStars")
async def handle_get_stars(query: StarQuery):
    print(query.ra, query.dec)
    result = query_stars(query.ra, query.dec)
    return result


@app.get("/getPlanets")
async def handle_get_planets(name: str = Query(None)):
    if not name:
        result = get_planets()
    else:
        result = getPlanetByQuery(name=name)
    return result


