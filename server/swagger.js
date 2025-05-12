import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Account Status Lost Ark - API',
            version: '1.0.0',
            description: 'Документация для AS LA - API',
        },
    },
    apis: ['./server/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
