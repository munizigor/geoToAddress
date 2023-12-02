const { Pool } = require("pg");
// const getRA = require("./getRA");
require("dotenv").config();

// const decodeString = (str) => {
//     if (str) {
//         return str.replace("Ã\u0081", "Á");
//     }
// };

// // Função para ordenar o dicionário com base no parâmetro 'name' em ordem alfabética
// function sortByParameter(array, parameter) {
//     return array.slice().sort((a, b) => {
//         const nameA = a[parameter].toLowerCase();
//         const nameB = b[parameter].toLowerCase();
//         if (nameA < nameB) return -1;
//         if (nameA > nameB) return 1;
//         return 0;
//     });
// }

// function isEmpty(obj) {
//     return Object.keys(obj).length === 0;
// }

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

async function getAddressByRadius(lat, long, radius) {
    const CORRECTION_FACTOR = 100000;
    const RADIUS_LIMIT = 200;
    informedRadius = radius;
    radius = Math.min(radius, RADIUS_LIMIT);
    calc_radius = radius / CORRECTION_FACTOR;

    let client;

    try {
        client = await pool.connect();

        const loteQuery = `
            SELECT ra.ra_nome, luos.lu_ra_luos, luos.lu_end_car, luos.lu_setor, luos.lu_quadra, luos.lu_conjunt, luos.lu_lote, luos.lu_end_car 
            FROM lote_luos luos 
            LEFT JOIN regioes_administrativas ra ON ra.ra_cira = luos.lu_ra_luos 
            WHERE ST_Intersects(luos.geom, ST_BUFFER(ST_SetSRID(ST_MakePoint($1, $2), 4326), $3))
            ORDER BY luos.lu_ra_luos, luos.lu_end_car;
            `;

        const ibgeQuery = `
            SELECT log.cd_setor, log.cd_quadra, log.cd_face, log.nm_log
            FROM logradouros log
            WHERE ST_Intersects(log.geom, ST_BUFFER(ST_SetSRID(ST_MakePoint($1, $2), 4326), $3))
            ORDER BY log.gid;
            `;

        const raQuery = `
            SELECT ra.ra_cira, ra.ra_nome 
            FROM regioes_administrativas ra 
            WHERE ST_Intersects(ra.geom, ST_BUFFER(ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)) 
            ORDER BY ra.ra_cira;
            `;

        const populacao_por_setor_censitarioQuery = `
            SELECT ra.cd_geocodi, ra.nm_subdist, ra.nm_distrit, ra.tipo, ra.nm_meso 
            FROM populacao_por_setor_censitario ra 
            WHERE ST_Intersects(ra.geom, ST_BUFFER(ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)) 
            ORDER BY ra.cd_geocodi;
            `;

        const rle_ruralQuery = `
            SELECT ra.rle_poligo, ra.rle_endere
            FROM rle_rural ra 
            WHERE ST_Intersects(ra.geom, ST_BUFFER(ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)) 
            `;

        const values = [long, lat, calc_radius];
        const loteResult = await client.query(loteQuery, values);
        const ibgeResult = await client.query(ibgeQuery, values);
        const raResult = await client.query(raQuery, values);
        const populacao_por_setor_censitarioResult = await client.query(
            populacao_por_setor_censitarioQuery,
            values
        );
        const rle_ruralResult = await client.query(rle_ruralQuery, values);

        // if (loteResult.rows.length === 0) {
        //     const raResult = await client.query(raQuery, values);
        //     enderecos = raResult.rows;
        // } else {
        ra = raResult.rows;
        enderecos = loteResult.rows;
        ibge = ibgeResult.rows;
        populacao_por_setor_censitario =
            populacao_por_setor_censitarioResult.rows;
        rle_rural = rle_ruralResult.rows;
        // }
        // console.log(loteResult.rows);
        return {
            success: true,
            params: {
                lat,
                long,
                informedAccuracy: informedRadius,
                consideredAccuracy: radius,
                unit: "meters",
            },
            message: {
                logradouros_ibge: ibge,
                enderecos,
                ra,
                populacao_por_setor_censitario,
                rle_rural,
            },
        };
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (client._connected) {
            await client.release(); // Libere a conexão de volta para o pool
        }
    }
}

module.exports = getAddressByRadius;
