import { Handler } from "@netlify/functions";
import { connectDatabase } from "../../db";
import { DogoModel } from "../../models/DogoModel";

export const deleteDogo: Handler = async (context, event) => {
  const pathParts = context.path.split("/api/dogos/");
  const dogoId = pathParts.length > 0 ? pathParts[1] : null;

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

  await dogo.remove();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Dogo deleted",
      id: dogoId,
    }),
  };
};
