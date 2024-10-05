import base64
from email.mime import base
import shutil
from tkinter import Image
from astroquery.gaia import Gaia
from astropy.coordinates import SkyCoord
import astropy.units as u
from fastapi import FastAPI, File, HTTPException, UploadFile
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
async def handle_get_planets(name: str = Query(None), detailed: bool = Query(False)):
    result = "Not Found"
    if not name:
        result = get_planets()
    elif name:
        print(name)
        print(detailed)
        result = getPlanetByQuery(name=name, detailed=bool(detailed))
    return result


class PublishQuery(BaseModel):
    image: str  # Expecting a Base64 encoded image


def save_base64_image(base64_string, output_file):
    # Remove the prefix if it exists
    if base64_string.startswith("data:image/png;base64,"):
        base64_string = base64_string.replace("data:image/png;base64,", "")

    # Decode the base64 string
    print(base64_string)
    image_data = base64.b64decode(base64_string)

    # Write the decoded data to a file
    with open(output_file, "wb") as file:
        file.write(image_data)


@app.post("/publish")
def handle_publish(query: PublishQuery):
    try:
        print(query.image)
        # Decode the image from Base64
        save_base64_image(query.image, "image.png")  # Save the image to a file
        return {"message": "Image saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error saving image: {str(e)}")
