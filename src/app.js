const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

// const path = require("path");
const getRA = require("./requests/getRA"); // Importe a função getRA do arquivo getRA.js
// const getAddress = require("./getAddress");
const getAddressByRadius = require("./requests/getAddressByRadius");
// const getLogradouro = require("./getLogradouro");
// const getSetorCensitario = require("./getSetorCensitario");

const app = express();

// Middleware para servir a documentação Swagger
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Define o diretório de arquivos estáticos (no caso, a pasta que contém o index.html)
// app.use(express.static(path.join(__dirname, "public")));

// // Rota para a raiz ("/") que serve o arquivo index.html
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/ra/:lat/:long", async (req, res) => {
//     const { lat, long } = req.params; // Acesse os parâmetros de caminho
//     if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
//         return res
//             .status(400)
//             .json({ error: "Latitude / longitude inválidas." });
//     }

//     try {
//         parsedLat = lat.replace(",", ".");
//         parsedLong = long.replace(",", ".");
//         const result = await getRA(
//             parseFloat(parsedLat),
//             parseFloat(parsedLong)
//         );
//         res.json({ result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Erro interno do servidor." });
//     }
// });

// app.get("/endereco/:lat/:long", async (req, res) => {
//     const { lat, long } = req.params; // Acesse os parâmetros de caminho
//     if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
//         return res
//             .status(400)
//             .json({ error: "Latitude / longitude inválidas." });
//     }

//     try {
//         parsedLat = lat.replace(",", ".");
//         parsedLong = long.replace(",", ".");
//         const result = await getAddress(
//             parseFloat(parsedLat),
//             parseFloat(parsedLong)
//         );
//         res.json({ result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Erro interno do servidor." });
//     }
// });

// app.get("/logradouro/:lat/:long", async (req, res) => {
//     const { lat, long } = req.params; // Acesse os parâmetros de caminho
//     if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
//         return res
//             .status(400)
//             .json({ error: "Latitude / longitude inválidas." });
//     }

//     try {
//         parsedLat = lat.replace(",", ".");
//         parsedLong = long.replace(",", ".");
//         const result = await getLogradouro(
//             parseFloat(parsedLat),
//             parseFloat(parsedLong)
//         );
//         res.json({ result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Erro interno do servidor." });
//     }
// });

// app.get("/setorcensitario/:lat/:long", async (req, res) => {
//     const { lat, long } = req.params; // Acesse os parâmetros de caminho
//     if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
//         return res
//             .status(400)
//             .json({ error: "Latitude / longitude inválidas." });
//     }

//     try {
//         parsedLat = lat.replace(",", ".");
//         parsedLong = long.replace(",", ".");
//         const result = await getSetorCensitario(
//             parseFloat(parsedLat),
//             parseFloat(parsedLong)
//         );
//         res.json({ result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Erro interno do servidor." });
//     }
// });

// // Rotas Swagger
// app.get("/swagger.json", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(swaggerSpec); // Retorne a especificação Swagger gerada pelo swagger.js
// });

/**
 * @swagger
 * /endereco_raio/{lat}/{long}/{raio}:
 *   get:
 *     summary: Buscar endereços em um raio específico a partir de coordenadas geográficas.
 *     description: Retorna uma lista de endereços dentro de um determinado raio em torno das coordenadas geográficas fornecidas.
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         description: Latitude das coordenadas geográficas.
 *         schema:
 *           type: number
 *       - in: path
 *         name: long
 *         required: true
 *         description: Longitude das coordenadas geográficas.
 *         schema:
 *           type: number
 *       - in: path
 *         name: raio
 *         required: false
 *         description: Raio de busca em metros.
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de endereços encontrados no raio especificado.
 *         content:
 *           application/json:
 *             example:
 *               result: {
 *                 success: true,
 *                 params: {
 *                   lat: -15.822170529540397,
 *                   long: -48.05871703732875,
 *                   informedAccuracy: 100,
 *                   consideredAccuracy: 100,
 *                   unit: "meters"
 *                 },
 *                 message: [
 *                   {
 *                     ra_nome: "TAGUATINGA",
 *                     lu_ra_luos: 3,
 *                     lu_end_car: "SETOR A NORTE QNA 33 LT 1",
 *                     lu_setor: "SETOR A NORTE",
 *                     lu_quadra: "QNA 33",
 *                     lu_conjunt: null,
 *                     lu_lote: "LT 1"
 *                   },
 *                   {
 *                     ra_nome: "TAGUATINGA",
 *                     lu_ra_luos: 3,
 *                     lu_end_car: "SETOR A NORTE QNA 33 LT 11",
 *                     lu_setor: "SETOR A NORTE",
 *                     lu_quadra: "QNA 33",
 *                     lu_conjunt: null,
 *                     lu_lote: "LT 11"
 *                   },
 *                   {
 *                     ra_nome: "TAGUATINGA",
 *                     lu_ra_luos: 3,
 *                     lu_end_car: "SETOR A NORTE QNA 33 LT 13",
 *                     lu_setor: "SETOR A NORTE",
 *                     lu_quadra: "QNA 33",
 *                     lu_conjunt: null,
 *                     lu_lote: "LT 13"
 *                   }
 *                 ]
 *               }
 *       '400':
 *         description: Requisição inválida devido a parâmetros incorretos (latitude ou longitude inválida).
 *         content:
 *           application/json:
 *             example:
 *               error: Latitude / longitude inválidas.
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Erro interno do servidor.
 */

app.get("/endereco_raio/:lat/:long/:raio?", async (req, res) => {
    const { lat, long, raio } = req.params; // Acesse os parâmetros de caminho
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
        return res
            .status(400)
            .json({ error: "Latitude / longitude inválidas." });
    } else {
        parsedLat = lat.replace(",", ".");
        parsedLong = long.replace(",", ".");
    }

    if (isNaN(parseFloat(raio))) {
        parsedRaio = 1;
    } else {
        parsedRaio = raio.replace(",", ".");
    }
    try {
        const result = await getAddressByRadius(
            parseFloat(parsedLat),
            parseFloat(parsedLong),
            parseFloat(parsedRaio)
        );
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});
