import { model, Schema } from "mongoose";

export interface Dogo {
  name: string;
  image: string;
}

const schema = new Schema<Dogo>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

export const DogosModel = model<Dogo>("Dogos", schema);
