const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GeoEnderecamento SSP-DF",
            version: "1.0.0",
            description: "API para busca de endereços no Distrito Federal",
        },
    },
    apis: ["src/app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
