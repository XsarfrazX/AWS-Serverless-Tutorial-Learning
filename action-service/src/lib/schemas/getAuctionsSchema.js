/**
 * Schema is the DTO object for requesting to a Lambda
 * It defines the JSON schema for a request, which can be used for validation
 */

 const schema ={

    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status:{
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'], 
                    default: 'OPEN', 
                },
            },
        },
    },
    required:[ 
        'queryStringParameters', 

    ], 



 };

 export default schema;