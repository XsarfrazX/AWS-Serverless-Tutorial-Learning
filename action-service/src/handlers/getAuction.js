import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient(); //dynamoDB access

/**
 * Factory function to getAuctionById from DB
 * @param {Auction Id} id 
 */
export async function getAuctionById(id){
    let auction;
    try{
        const result = await dynamodb.get({ 
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();  // query from dynamoDB
        
        auction = result.Item;

    } catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    
    if(!auction) {
        throw new createError.NotFound(`Auction with ID "${id}" Not found`.toString());
    }


    return auction;
}

/**
 * Function or AWS lambda to get Auction by ID
 * i.e. Querying from dynamoDB using primary partition key
 * @param {Http request data} event 
 * @param {meta deta} context 
 */
async function getAuction(event, context) {

    const { id } = event.pathParameters; //extract id from request path

    const auction = await getAuctionById(id);


  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(getAuction);


