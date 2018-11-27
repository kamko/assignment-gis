const {Pool} = require('pg');

const pool = new Pool(
    {
        connectionString: 'postgresql://pdt:pdt-gis@pdt.kamko.pw:5432/pdt'
    }
);

const findTown = ({lng, lat}) => new Promise((resolve, reject) =>
    pool.query(`
    WITH data as (SELECT *
              FROM planet_osm_polygon
              WHERE admin_level = '9'
                and st_within(st_setsrid(st_makepoint($1, $2), 4326), way))
        SELECT jsonb_build_object(
                   'type', 'Feature',
                   'geometry', st_asgeojson(way)::jsonb,
                   'properties', (SELECT row_to_json(_) FROM (SELECT data.name) as _),
                   'id', uid
                 ) as geojson
        FROM data`
        , [lng, lat])
        .then(data => resolve(data.rows[0].geojson))
        .catch(err => {
            console.error(`Nothing found for [${lng}, ${lat}] ${err}`);
            resolve({});
        })
);

const churches = ({townId}) => new Promise((resolve, reject) =>
    pool.query(
        `WITH town as (SELECT name, way
                        FROM planet_osm_polygon
                        WHERE uid=$1),
            data as (SELECT *
                  FROM planet_osm_polygon
                  WHERE amenity = 'place_of_worship'
                    AND st_within(way, (SELECT way FROM town)))
            SELECT
              jsonb_build_object(
                  'type', 'FeatureCollection',
                  'features', jsonb_agg(features.jsonb_build_object)
                ) as geojson
            FROM (SELECT jsonb_build_object(
                             'type', 'Feature',
                             'geometry', st_asgeojson(way)::jsonb,
                             'properties', (SELECT row_to_json(_) FROM (SELECT data.name, data.religion, data.religion, data.denomination) as _),
                             'id', uid
                           )
                  FROM data) features;`
        , [townId])
        .then(data => {
            console.log(`Fetching churches for town uid=${townId}`);
            resolve(data.rows[0].geojson)
        })
        .catch(err => {
            console.error(`No church found for townId=${townId} ${err}`);
            resolve({});
        })
);

export {
    churches,
    findTown
};