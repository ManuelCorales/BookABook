
export default async function consultarMicroservicio(query, puerto){
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