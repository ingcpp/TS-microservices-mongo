import { Handler } from "@netlify/functions";
import { connectDatabase } from "../../db";
import { Dogo, DogoModel } from "../../models/DogoModel";

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

    const pathParts = context.path.split("/api/dogos/");
    const dogoId = pathParts.length > 0 ? pathParts[1] : null;

    const { body } = context;
    const parsedBody = body ? JSON.parse(body) : null;

    await connectDatabase();
    const dogo = dogoId ? await DogoModel.findById(dogoId) : null;

    if (!dogo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Dogo not found with id ${dogoId}`,
        }),
      };
    }

    const updates: Partial<Dogo> = {};

    if ("name" in parsedBody) {
      updates.name = parsedBody.name;
    }
    if ("age" in parsedBody) {
      updates.age = parsedBody.age;
    }
    if ("imageURL" in parsedBody) {
      updates.imageURL = parsedBody.imageURL;
    }

    await dogo.set(updates).save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Dogo updated",
        dogo,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
