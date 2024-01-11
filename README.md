# GeoToAddress - Reverse Geocoding Service

Este é um serviço de reverse geocoding que permite obter informações de localização para o Distrito Federal com base em coordenadas geográficas (latitude e longitude). Ele inclui endpoints para recuperar informações de Região Administrativa (RA), endereço completo, logradouro e setor censitário com base nas coordenadas fornecidas.

## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)
- [Git LFS](https://git-lfs.com/) - Git pra arquivos maiores que 100MB. Necessário para baixar os arrquivos .geojson

## Instalação

1. Clone este repositório:

   ```bash
   git lfs clone https://github.com/munizigor/geoToAddress.git
   cd geoToAddress

2. Instale as dependências:

    ```bash
    npm install

3. Renomeie o arquivo *.env-example* para *.env*
4. Caso necessário, redefina as variáveis de ambiente

## Uso

### Usando Docker

Use docker compose.

1. Construa a imagem Docker:

    ```bash
    docker compose up -d --build

2. Entre no container do PostGIS:

    ```bash
    docker exec -it geotoaddress-postgis bash -c shapes/database.sh

3. Aguarde o término da instalação

A documentação da API no Swagger estará disponível em <http://localhost:3000/api>.

## Endpoints

- /endereco_raio/:lat/:long/radius?: Retorna uma lista de endereços dentro do raio, com base em latitude, longitude e raio de precisão (este último opcional).
    1. Caso o raio de precisão não seja informado, será considerado o valor de **100 metros**.
    2. O raio máximo considerado será de **200 metros**.

Certifique-se de substituir :lat e :long pelos valores de latitude e longitude desejados nos URLs dos endpoints.

## Exemplo

- Request

    ```bash
    curl http://localhost:3000/endereco_raio/-15.833093710739497/-48.060005754915714/10

- Response

    ```bash
    {
    "result": {
        "success": true,
        "message": {
           "ra_cira": 3,
           "ra_nome": "TAGUATINGA",
           "ibge_cd_setor": "530010805080250",
           "ibge_cd_sit": "1",
           "ibge_nm_sit": "Área Urbana de Alta Densidade de Edificações",
           "ibge_cd_uf": "53",
           "ibge_nm_uf": "Distrito Federal",
           "ibge_sigla_uf": "DF",
           "ibge_cd_mun": "5300108",
           "ibge_nm_mun": "Brasília",
           "ibge_cd_dist": "530010805",
           "ibge_nm_dist": "Brasília",
           "ibge_cd_subdist": "53001080508",
           "ibge_nm_subdist": "Taguatinga",
           "logradouro_ibge": null,
           "endereco_completo": "SETOR B NORTE AE 7 CORPO DE BOMBEIROS",
           "setor": "SETOR B NORTE",
           "lote": "AE 7 CORPO DE BOMBEIROS"
        }
    }
    }

## Contribuição

Sinta-se à vontade para contribuir para este projeto abrindo problemas ou enviando solicitações pull.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para obter detalhes.
