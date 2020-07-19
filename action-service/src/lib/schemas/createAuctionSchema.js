/**
 * Schema is the DTO object for requesting to a Lambda
 * It defines the JSON schema for a request, which can be used for validation
 */

const schema = {
    properties: {

        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
            },

            required: ['title',],
        },
    },

    required: [
        'body',
    ],

};

 export default schema;