import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();


/**
 * Function or AWS lambda to scan all auction items from
 * the dynamoDB table
 * @param {Http request data} event 
 * @param {meta deta} context 
 */
async function getAuctions(event, context) {

    let auctions;

    try{
        const result = await dynamodb.scan({ TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise();

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

export const handler = commonMiddleware(getAuctions);

