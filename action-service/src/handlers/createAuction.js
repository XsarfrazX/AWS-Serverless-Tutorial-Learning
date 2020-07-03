async function createAuction(event, context) {
  // event -> request header, body,etc. 
  // context -> meta data for event

const {title } = JSON.parse(event.body);
 const now = new Date();
const auction = {
  title,
  status: 'OPEN',
  createdAt: now.toISOString()
}

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;


