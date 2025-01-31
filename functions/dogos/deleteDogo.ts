import { Handler } from "@netlify/functions";
import { connectDatabase } from "../../db";
import { DogosModel } from "../../models/DogosModel";

export const deleteDogo: Handler = async (context, event) => {
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
      const idDogo = parsedBody._id;
      await connectDatabase();
      try {
        const dogo = await DogosModel.findById(idDogo);
        if (dogo) {
          await dogo.remove();
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: "Registro eliminado exitosamente",
            }),
          };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({
              message: "No se encuentra el registro a eliminar",
            }),
          };
        }
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Falla interna del servidor",
          }),
        };
      }
    } else {
      return {
        statusCode: 500,
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
