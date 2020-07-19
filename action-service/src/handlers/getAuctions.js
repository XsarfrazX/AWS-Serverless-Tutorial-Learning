import AWS from 'aws-sdk';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();


/**
 * Function or AWS lambda to scan all auction items from
 * the dynamoDB table
 * @param {Http request data} event 
 * @param {meta deta} context 
 */
async function getAuctions(event, context) {

    let auctions;
    const { status } = event.queryStringParameters; //status queryParams to be provided in API call

    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status', //AWS DynamoDB specific
      ExpressionAttributeValues: {
          ':status': status,
      },
      ExpressionAttributeNames: {
          '#status': 'status', // #status because status has a predefined meaning in DynamoDB
      }
  }; //query params 

    try{
        const result = await dynamodb.query(params).promise();

        auctions = result.Items;

    } catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }



  return {
    statusCode: 200,
    body: JSON.stringify({ auctions }),
  };
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({inputSchema: getAuctionsSchema, useDefaults: true}));

