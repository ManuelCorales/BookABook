var mysql = require('mysql');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const path = require('path')
require('dotenv').config({path:"../../.env"});
const cors = require('cors')
const fetch = require('node-fetch');

class MicroservicioBase{
    constructor(){
        // Conexión con mysql
        this.con = mysql.createConnection({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASS}`
        });

        this.con.connect(function(err) {
            if (err) throw err;
            console.log("Conectadooo!");
        });

        this.con.query(`USE ${process.env.DB_NAME};`, (err, result) =>{
            if (err) throw err;
        })
    }

    initGraphQL(puerto, schema, root){
        // Construct a schema, using GraphQL schema language
        var schema = buildSchema(schema);
        var app = express();
        app.use(cors());
        app.use('/', graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));
        app.listen(puerto);
        console.log(`Corriendo en el puerto: http://localhost:${puerto}/`);
    }
    
    async consulta(query, callback){
        let resultado = await new Promise((resolve, reject) => {
            this.con.query(query, async (err, result) =>{
                if(!err){
                    resolve(result);
                } else {
                    console.log(err);
                    reject(err);
                }
            })
        })
        return resultado;
    }
    async consultarMicroservicio(query, puerto){
        /* 
            Ejemplo que query 
                let query = {
                    "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo}}`,
                    "variables": {
                        "slug": "100-anos-de-soledad"
                    }
                }
        */
        const response = await fetch(`http://localhost:${puerto}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });
        let respuesta = await response.json().then((data)=> data);
        return respuesta;
    }
}

module.exports = MicroservicioBase;