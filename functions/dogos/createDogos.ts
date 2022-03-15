import { Handler } from "@netlify/functions";
import { connectDatabase } from "../../db";
import { DogosModel } from "../../models/DogosModel";

export const createDogo: Handler = async (context, event) => {
  try {
    if (context.headers["content-type"] !== "application/json") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid content type, expected application/json",
        }),
      };
    }

    const { body } = context;
    const parsedBody = body && body.length > 0 ? JSON.parse(body) : null;

    if (
      parsedBody &&
      "name" in parsedBody &&
      parsedBody &&
      "image" in parsedBody
    ) {
      await connectDatabase();

      const newDogo = new DogosModel({
        name: parsedBody.name,
        image: parsedBody.image,
      });

      await newDogo.save();

      return {
        statusCode: 200,
        body: JSON.stringify({
          Dogo: newDogo,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid input, name, lastName and address are required",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
