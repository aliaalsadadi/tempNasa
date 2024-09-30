from astroquery.gaia import Gaia
from astropy.coordinates import SkyCoord
import astropy.units as u
import numpy as np

Gaia.ROW_LIMIT = 20000


def color_index_to_rgb(temp: float):
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

    # Build the SQL query for the box search
    query = f"""
        SELECT source_id, ra, dec, phot_g_mean_mag, distance_gspphot, parallax, bp_rp, bp_g, g_rp , teff_gspphot
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
            "hex_color": color_index_to_rgb(row["teff_gspphot"]),
        }
        for row in result
    ]

    return filtered_result
