import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();


/**
 * Function or AWS lambda to create/POST an auction to
 * the dynamoDB table
 * @param {Http request data} event 
 * @param {meta deta} context 
 */
async function createAuction(event, context) {
  // event -> request header, body,etc. 
  // context -> meta data for event

  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() +1);

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(), 
    highestBid:{
      amount: 0,
    }
  }

  try{

    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();

  } catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);

  }



  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(createAuction);


