import { Handler } from "@netlify/functions";
import { readDogos } from "./readDogos";
import { createDogo } from "./createDogos";
import { updateDogo } from "./updateDogo";

const handler: Handler = (event, context, callback) => {
  switch (event.httpMethod) {
    case "GET":
      return readDogos(event, context, callback);
      break;
    case "POST":
      return createDogo(event, context);
      break;
    case "PUT":
      return updateDogo(event, context);
      break;
  }
};

export { handler };
