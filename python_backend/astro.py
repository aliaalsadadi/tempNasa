from functools import cache
from astroquery.gaia import Gaia
from astroquery.ipac.nexsci.nasa_exoplanet_archive.core import NasaExoplanetArchive
from astropy.coordinates import SkyCoord
import astropy.units as u
import numpy as np
import requests
import math


Gaia.ROW_LIMIT = 20000


def color_index_to_rgb(temp: float):
    """
    Convert a color index (surface temperature) to a corresponding RGB color.

    Parameters
    ----------
    temp : float
        The color index, in Kelvin.

    Returns
    -------
    str
        The corresponding RGB color, as a hex string.
    """
    if temp >= 30000:
        return "#9bb0ff"  # O class - Blue
    elif temp >= 10000:
        return "#aabfff"  # B class - Blue-White
    elif temp >= 7500:
        return "#cad7ff"  # A class - White
    elif temp >= 6000:
        return "#f8f7ff"  # F class - Yellow-White
    elif temp >= 5200:
        return "#fff4e8"  # G class - Yellow
    elif temp >= 3700:
        return "#ffd2a1"  # K class - Orange
    else:
        return "#ffcccc"  # M class - Red


def get_stars(ra: float, dec: float, box_size: float = 3.0):
    """
    table columns comes from https://gea.esac.esa.int/archive/documentation/GDR3/Gaia_archive/chap_datamodel/sec_dm_main_source_catalogue/ssec_dm_gaia_source.html
    Performs a box search around the given RA and Dec coordinates, fetching
    the Gaia DR3 data for stars within the box.

    Parameters
    ----------
    ra : float
        The right ascension of the center of the box, in degrees.
    dec : float
        The declination of the center of the box, in degrees.
    box_size : float, optional
        The size of the box, in degrees. Defaults to 3.0.

    Returns
    -------
    A list of dictionaries, containing the data for the stars in the box.
    Each dictionary has the following keys:

    - designation: A string with the designation of the star.
    - source_id: A string with the source ID of the star.
    - ra: The right ascension of the star, in degrees.
    - dec: The declination of the star, in degrees.
    - phot_g_mean_mag: The mean magnitude of the star in the G band.
    - distance: The distance to the star, in parsecs.
    - parallax: The parallax of the star, in mas.
    - temp: The effective temperature of the star, in Kelvin.
    - hex_color: A string with the hex color code corresponding to the
      star's effective temperature, according to the B-V color index.
    """
    query = f"""
        SELECT source_id, designation ,ra, dec, phot_g_mean_mag, distance_gspphot, parallax, bp_rp, bp_g, g_rp , teff_gspphot
        FROM gaiadr3.gaia_source
        WHERE
            1=CONTAINS(
                POINT('ICRS', ra, dec),
                CIRCLE('ICRS', {ra}, {dec}, 60.0)
            ) AND
            phot_g_mean_mag < 20.5 AND
            parallax IS NOT NULL AND
            distance_gspphot IS NOT NULL AND
            bp_rp IS NOT NULL AND
            bp_g IS NOT NULL AND
            g_rp IS NOT NULL AND
            teff_gspphot IS NOT NULL
    """

    # Execute the query
    job = Gaia.launch_job(query)
    result = job.get_results()
    # StarData
    filtered_result = [
        {
            "designation": str(row["designation"]),
            "source_id": str(row["source_id"]),
            "ra": float(row["ra"]),
            "dec": float(row["dec"]),
            "phot_g_mean_mag": (
                float(row["phot_g_mean_mag"])
                if np.isfinite(row["phot_g_mean_mag"])
                else None
            ),
            "distance": float(row["distance_gspphot"]),
            "parallax": float(row["parallax"]),
            "temp": float(row["teff_gspphot"]),
            "hex_color": color_index_to_rgb(row["teff_gspphot"]),
        }
        for row in result
    ]

    return filtered_result


def get_planets(discover_method: str = None):
    """
    table columns come from here https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html
    """
    # Construct the where query based on discovery method and non-null pl_masse
    where_conditions = []

    if discover_method:
        where_conditions.append(f"discoverymethod like '{discover_method}'")

    # Ensure pl_masse is not null
    where_conditions.append("pl_masse is not null")
    where_conditions.append("pl_radj is not null")
    where_conditions.append("pl_eqt is not null")
    where_conditions.append("pl_orbper is not null")
    # Combine where conditions with 'AND'
    where_query = " AND ".join(where_conditions) if where_conditions else None
    print(where_query)

    # Define the parameters for the query
    query_params = {
        "table": "pscomppars",
        "select": "top 100 pl_name,disc_year,ra,dec,discoverymethod,pl_rade,pl_radj,pl_masse,pl_massj, pl_eqt,pl_orbper",
        "cache": True,
    }

    # Add the where parameter only if there are conditions
    if where_query:
        query_params["where"] = where_query

    # Perform the query
    result = NasaExoplanetArchive.query_criteria(**query_params)
    print(result[0]["pl_eqt"])
    # Process the result
    # PlanetData
    result = [
        {
            "name": row["pl_name"],
            "ra": float(row["ra"].value),
            "dec": float(row["dec"].value),
            "disc_year": int(row["disc_year"]),
            "discover_method": row["discoverymethod"],
            "pl_rade": float(row["pl_rade"].value),
            "pl_radj": float(row["pl_radj"].value),
            "pl_masse": float(row["pl_masse"]),
            "pl_massj": float(row["pl_massj"]),
            "pl_eqt": float(row["pl_eqt"].value),
            "pl_orbper": float(row["pl_orbper"].value),
        }
        for row in result
    ]
    print()
    return result


def getPlanetByQuery(name: str, detailed: bool = False):
    print("name2: ", name)
    print("detailed2: ", name)

    # Initialize the where clause with the name condition
    where_clause = []
    where_clause.append(f"pl_name like '{name}'")
    # where_clause.append("pl_rade is not null")
    # where_clause.append("pl_radj is not null")
    # where_clause.append("pl_eqt is not null")
    where_query = " AND ".join(where_clause) if where_clause else None
    query_params = {
        "table": "pscomppars",
        "select": "top 10 pl_name,disc_year,ra,dec,discoverymethod,pl_rade,pl_radj,pl_masse,pl_massj,pl_eqt",
        "cache": True,
        "where": where_query,
    }
    if detailed:
        query_params = {
            "table": "pscomppars",
            "select": "top 10 pl_name,disc_year,ra,dec,discoverymethod,pl_rade,pl_radj,pl_masse,pl_massj,pl_eqt,pl_orbper,pl_rvamp,pl_dens,pl_angsep",
            "cache": True,
            "where": where_query,
        }

    result = NasaExoplanetArchive.query_criteria(**query_params)
    if detailed:
        result = [
            {
                "name": row["pl_name"],
                "ra": float(row["ra"].value),
                "dec": float(row["dec"].value),
                "disc_year": int(row["disc_year"]),
                "discover_method": row["discoverymethod"],
                "pl_rade": float(row["pl_rade"].value),
                "pl_radj": float(row["pl_radj"].value),
                "pl_masse": float(row["pl_masse"]),
                "pl_massj": float(row["pl_massj"]),
                "pl_eqt": float(row["pl_eqt"].value),
                "pl_orbper": float(row["pl_orbper"].value),
                "pl_rvamp": float(row["pl_rvamp"].value),
                "pl_dens": float(row["pl_dens"].value),
                "pl_angsep": float(row["pl_angsep"].value),
            }
            for row in result
        ]
    else:
        result = [
            {
                "name": row["pl_name"],
                "ra": float(row["ra"].value),
                "dec": float(row["dec"].value),
                "disc_year": int(row["disc_year"]),
                "discover_method": row["discoverymethod"],
                "pl_rade": float(row["pl_rade"].value),
                "pl_radj": float(row["pl_radj"].value),
                "pl_masse": float(row["pl_masse"]),
                "pl_massj": float(row["pl_massj"]),
                "pl_eqt": float(row["pl_eqt"].value),
            }
            for row in result
        ]
    # Filter out None or NaN values
    filtered_result = [
        {
            k: (
                "no information"
                if v is None or (isinstance(v, float) and math.isnan(v))
                else v
            )
            for k, v in planet.items()
        }
        for planet in result
    ]
    print(filtered_result)
    return filtered_result
