import { CountryModel } from "./location-schemas.js";

export const getAllCountrie = async () => {
  const countries = await CountryModel.find({
    select: { code: true, name: true },
  });
  return countries;
};
