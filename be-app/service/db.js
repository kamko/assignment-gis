const {Pool} = require('pg');

const pool = new Pool();

const hlohovec = async () => {
    const data = await pool.query(
            `SELECT name, st_asgeojson(way) as bratislava_way
             FROM planet_osm_polygon
             WHERE boundary = 'administrative'
               and admin_level = '9'
               and name LIKE 'Hlohovec'`
    );

    return {
        name: data.rows[0].name,
        way: data.rows[0].bratislava_way
    }
};

export {
    hlohovec
};