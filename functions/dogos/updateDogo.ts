import { Handler } from "@netlify/functions";
import { connectDatabase } from "../../db";
import { DogosModel } from "../../models/DogosModel";

export const updateDogo: Handler = async (context, event) => {
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

    if (parsedBody && "_id" in parsedBody) {
      await connectDatabase();
      const idDogo = parsedBody._id;
      const dogo = await DogosModel.findById(idDogo);
      if (dogo) {
        const newName = parsedBody.name ? parsedBody.name : dogo.name;
        const newImage = parsedBody.image ? parsedBody.lastName : dogo.image;

        await dogo
          .set({
            name: newName,
            image: newImage,
          })
          .save();
        return {
          statusCode: 200,
          body: JSON.stringify({
            Dogo: dogo,
          }),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "No se encuentra el registro a actualizar",
          }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid input, id is required",
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
