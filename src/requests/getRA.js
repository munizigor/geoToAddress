const fs = require("fs").promises;
const proj4 = require("proj4");
const shapefile = require("shapefile");
const turf = require("@turf/turf");

async function loadProjection() {
    try {
        const data = await fs.readFile(
            "./files/ras/regioes_administrativas.prj",
            "utf-8"
        );
        return proj4(data);
    } catch (error) {
        console.error(error);
        throw error; // Repassar o erro para a função chamadora, se necessário
    }
}

async function getRA(lat, long) {
    return new Promise(async (resolve, reject) => {
        try {
            const shapefileProjection = await loadProjection();
            const source = await shapefile.open(
                "./files/ras/regioes_administrativas.shp",
                "./files/ras/regioes_administrativas.dbf",
                { encoding: "utf-8" }
            );
            const pointWGS84 = turf.point([long, lat]);
            const pointShapefile = proj4(
                "+proj=longlat +ellps=WGS84 +datum=WGS84",
                shapefileProjection,
                pointWGS84.geometry.coordinates
            );

            let result = await source.read();
            while (!result.done) {
                const feature = result.value;
                if (
                    turf.booleanPointInPolygon(pointShapefile, feature.geometry)
                ) {
                    resolve({
                        success: true,
                        message: {
                            ra_cira: feature.properties.ra_cira,
                            ra_nome: feature.properties.ra_nome,
                        },
                    }); // Resolve com o nome da região
                    return;
                }
                result = await source.read();
            }
            resolve({
                success: false,
                message: {
                    ra_cira: null,
                    ra_nome: "Local não está no Distrito Federal",
                },
            }); // Resolve com a mensagem padrão
        } catch (error) {
            reject(error); // Rejeita a Promise em caso de erro
        }
    });
}

module.exports = getRA;
