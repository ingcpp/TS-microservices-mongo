import { Handler } from "@netlify/functions";
import { readDogos } from "./readDogos";
import { createDogo } from "./createDogos";

const handler: Handler = (event, context, callback) => {
  switch (event.httpMethod) {
    case "GET":
      return readDogos(event, context, callback);
      break;
    case "PUT":
      return createDogo(event, context);
  }
};

export { handler };
