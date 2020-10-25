var mysql = require('mysql');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const path = require('path')
require('dotenv').config({path:"../../.env"});

class MicroservicioBase{
    constructor(puerto){
        // Conexión con mysql
        var con = mysql.createConnection({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASS}`
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Conectadooo!");
        });

        // Construct a schema, using GraphQL schema language
        var schema = buildSchema(`
        type Query {
            hello: String
        }
        `);

        // The root provides a resolver function for each API endpoint
        var root = {
            hello: () => {
                return 'Hello world!';
            },
        };

        var app = express();
        app.use('/graphql', graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));
        app.listen(puerto);
        console.log(`Running a GraphQL API server at http://localhost:${puerto}/graphql`);
    }
    
    consulta(query){
        query = "SELECT * FROM usuarios;"
        con.query(`USE ${process.env.DB_HOST};`, (err, result) =>{
            console.log(err, result);
        })

        con.query(query, (err, result) =>{
            console.log(err, result);
        })
    }
}

module.exports = MicroservicioBase;