from functools import cache
from astroquery.gaia import Gaia
from astroquery.ipac.nexsci.nasa_exoplanet_archive.core import NasaExoplanetArchive
from astropy.coordinates import SkyCoord
import astropy.units as u
import numpy as np
import requests


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
    table columns comes from here https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html
    """
    # Construct the where query only if discover_method is provided
    where_query = (
        f"discoverymethod like '{discover_method}'" if discover_method else None
    )
    print(where_query)

    # Define the parameters for the query
    query_params = {
        "table": "pscomppars",
        "select": "top 100 pl_name,disc_year,ra,dec,discoverymethod,pl_rade",
        "cache": True,
    }

    # Add the where parameter only if a discover_method is specified
    if where_query:
        query_params["where"] = where_query

    # Perform the query
    result = NasaExoplanetArchive.query_criteria(**query_params)
    print(result)
    # Process the result
    result = [
        {
            "name": row["pl_name"],
            "ra": float(row["ra"].value),
            "dec": float(row["dec"].value),
            "disc_year": int(row["disc_year"]),
            "discover_method": row["discoverymethod"],
            "pl_rade": float(row["pl_rade"].value),
        }
        for row in result
    ]

    print(result)
    return result
