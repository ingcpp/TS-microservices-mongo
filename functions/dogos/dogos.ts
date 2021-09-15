import { Handler } from "@netlify/functions";
import { createDogos } from "./createDogos";
import { deleteDogo } from "./deleteDogo";
import { readDogos } from "./readDogos";
import { updateDogo } from "./updateDogo";

const handler: Handler = (event, context, callback) => {
  switch (event.httpMethod) {
    case "GET":
      return readDogos(event, context, callback);
      break;
    case "POST":
      return createDogos(event, context, callback);
      break;
    case "DELETE":
      return deleteDogo(event, context, callback);
      break;
    case "PUT":
      return updateDogo(event, context, callback);
      break;
  }

  return { statusCode: 501 };
};

export { handler };
