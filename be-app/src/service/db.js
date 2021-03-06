const {Pool} = require('pg');

const pool = new Pool(
    {
        connectionString: 'postgresql://pdt:pdt-gis@pdt.kamko.pw:5432/pdt'
    }
);

const findTown = ({lng, lat}) => new Promise((resolve) =>
    pool.query(`
    WITH data as (SELECT *
              FROM cz_sk_towns
              WHERE st_within(st_setsrid(st_makepoint($1, $2), 4326), way))
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

const worshipPlaces = ({townId}) => new Promise((resolve) =>
    pool.query(
        `WITH town as (SELECT name, way
              FROM planet_osm_polygon
              WHERE uid=$1),
     data as (SELECT *
              FROM worship_places
     WHERE st_within(way, (SELECT way FROM town)))
SELECT
  jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(features.jsonb_build_object)
    ) as geojson
FROM (SELECT jsonb_build_object(
                 'type', 'Feature',
                 'geometry', st_asgeojson(way)::jsonb,
                 'properties', (SELECT row_to_json(_) FROM (SELECT data.name, data.religion, data.building, data.denomination) as _)
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

const nearbyWorshipPlaces = ({lng, lat, range}) => new Promise((resolve) =>
    pool.query(
        `WITH data as (SELECT *
          FROM worship_places
            WHERE st_dwithin(way::geography, st_setsrid(st_makepoint($1, $2)::geography, 4326), $3))
            SELECT
              jsonb_build_object(
                  'type', 'FeatureCollection',
                  'features', jsonb_agg(features.jsonb_build_object)
                ) as geojson
            FROM (SELECT jsonb_build_object(
                             'type', 'Feature',
                             'geometry', st_asgeojson(way)::jsonb,
                             'properties', (SELECT row_to_json(_) FROM (SELECT data.name, data.religion, data.building, data.denomination) as _)
                           )
                  FROM data) features;`
        , [lng, lat, range])
        .then(data => {
            console.log(`Fetching churches for [${lng}, ${lat}, ${range}]`);
            resolve(data.rows[0].geojson)
        })
        .catch(err => {
            console.error(`Nothing found for [${lng}, ${lat}, ${range}] ${err}`);
            resolve({});
        })
);

const religions = () => new Promise((resolve) =>
    pool.query(`SELECT DISTINCT coalesce(religion, 'unknown') as religion
                FROM worship_places;`)
        .then(data => {
            console.log(`Fetching religions`, data);
            resolve(data.rows)
        })
        .catch(err => resolve([]))
);

const waterways = ({lng, lat}) => new Promise((resolve) =>
        pool.query(
            `WITH data as (WITH
              rivers as (SELECT name, way FROM planet_osm_line WHERE waterway IS NOT NULL),
              my_point as (SELECT st_setsrid(st_makepoint($1, $2), 4326) as point)
              SELECT r.name, r.way, st_distance(way::geography, point) distance
              FROM rivers r,
                   my_point
              WHERE st_dwithin(way::geography, point, 15000)
              ORDER BY distance ASC
              LIMIT 1
            )
            SELECT
              jsonb_build_object(
                  'type', 'FeatureCollection',
                  'features', jsonb_agg(features.jsonb_build_object)
                ) as geojson
            FROM (SELECT jsonb_build_object(
                             'type', 'Feature',
                             'geometry', st_asgeojson(way)::jsonb,
                             'properties',
                             (SELECT row_to_json(_) FROM (SELECT data.name, data.distance) as _)
                           )
                  FROM data) features;`, [lng, lat]
        ).then(res => {
            console.log(`roads: ${lat} ${lng}`);
            resolve(res.rows[0].geojson)
        })
            .catch(err => {
                console.error(`Nothing found for ...(${err})`);
                resolve({})
            })
    )
;
export {
    worshipPlaces,
    findTown,
    nearbyWorshipPlaces,
    religions,
    waterways
};