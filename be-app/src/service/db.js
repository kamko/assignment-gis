const {Pool} = require('pg');

const pool = new Pool();

const findTown = ({lng, lat}) => new Promise((resolve, reject) =>
    pool.query(`
    WITH data as (SELECT *
              FROM planet_osm_polygon
              WHERE admin_level = '9'
                and st_within(st_setsrid(st_makepoint($1, $2), 4326), way))
SELECT jsonb_build_object(
           'type', 'Feature',
           'geometry', st_asgeojson(way)::jsonb,
           'properties', (SELECT row_to_json(_) FROM (SELECT data.name) as _)
         ) as geojson
FROM data`, [lng, lat])
        .then(data => resolve(data.rows[0].geojson))
        .catch(err => {
            console.error(`Nothing found for [${lng}, ${lat}] ${err}`);
            resolve({});
        })
);

const kostoly_ba = async () => {
    const data = await pool.query(
        `WITH bratislava as (SELECT name, way
                    FROM planet_osm_polygon
                    WHERE admin_level = '9'
                      and name = 'Bratislava - mestská časť Staré Mesto'),
     data as (SELECT way, name, religion
              FROM planet_osm_polygon
              WHERE amenity = 'place_of_worship'
                AND st_within(way, (SELECT way FROM bratislava)))
SELECT
  jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(features.jsonb_build_object)
    ) as geojson
FROM (SELECT jsonb_build_object(
                 'type', 'Feature',
                 'geometry', st_asgeojson(way)::jsonb,
                 'properties', (SELECT row_to_json(_) FROM (SELECT data.name, data.religion) as _)
               )
      FROM data) features;`
    );

    return data.rows[0].geojson;
};

export {
    kostoly_ba,
    findTown
};