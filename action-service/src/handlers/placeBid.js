import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();


/**
 * Function or AWS lambda to update the highbest bid for 
 * an auction
 * @param {Http request} event 
 * @param {Meta data } context 
 */
async function placeBid(event, context) {

    const { id } = event.pathParameters; //extract id from request path
    const { amount } = event.body;

    const params ={
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount', //dynamoDB specific 
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW', 

    }; 

    let updatedAuction;

    try{
        const result = await dynamodb.update(params).promise(); // update dynamoDB
        updatedAuction = result.Attributes;

    } catch(error){
        throw new createError.InternalServerError(error);
    }


  return {
    statusCode: 200,
    body: JSON.stringify({ updatedAuction }),
  };
}

export const handler = commonMiddleware(placeBid);

