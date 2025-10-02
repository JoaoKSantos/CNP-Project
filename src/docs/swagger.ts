import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CNP - Cadastro Nacional de Pedófelos',
            version: '1.0.0',
            description: 'API de cadastro e consulta de criminosos sexuias.'
        },
        componets:{
            schemas: {
                ValidationError:{
                    type: 'objetct',
                    properties: {
                        type: {
                            type: 'string',
                            example:'ValidationError'
                        },
                        errors:{
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    message: {type: 'string'},
                                    field: {type: 'string'}
                                }
                            }
                        }
                    }
                }
            },

            secutitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat:  'JWT',
                    description: 'Insira o token JWT (Bearer) para autenticação.'
                }
            }

        },


        servers: [{
            url: '/api'
        }]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);