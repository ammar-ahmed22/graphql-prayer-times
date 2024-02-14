import { InputType, Field, Float } from "type-graphql";
import { OnlyWith } from "../validation/OnlyWith";
import { OnlyWithout } from "../validation/OnlyWithout";
import axios, { Axios } from "axios";


@InputType()
class LocationInput {
  @Field(type => Float, { nullable: true })
  @OnlyWith("lng")
  @OnlyWithout(["country", "city", "address"])
  public lat: number;

  @Field(type => Float, { nullable: true })
  @OnlyWith("lat")
  @OnlyWithout(["country", "city", "address"])
  public lng: number;

  @Field(type => String, { nullable: true })
  @OnlyWith("country")
  @OnlyWithout(["lat", "lng", "address"])
  public city: string;

  @Field(type => String, { nullable: true })
  @OnlyWith("city")
  @OnlyWithout(["lat", "lng", "address"])
  public country: string;

  @Field(type => String, { nullable: true })
  @OnlyWithout(["lat", "lng", "city", "country"])
  public address: string;

  public async getCoords(): Promise<[number, number]> {
    if (this.lat && this.lng) return [this.lat, this.lng];
    const baseURL = "https://nominatim.openstreetmap.org";
    const axios = new Axios({
      baseURL,
      headers: {
        "User-Agent": "graphql-prayer-times"
      }
    });
    
    if (this.city && this.country) {
      const resp = await axios.get("/search", {
        params: {
          city: this.city,
          country: this.country,
          format: "json"
        }
      });
      const data = await JSON.parse(resp.data);
      if (data.length === 0) throw new Error(`No results found for city = \`${this.city}\` and \`${this.country}\`!`);
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      return [lat, lng];
    }
    if (this.address) {
      const resp = await axios.get("/search", {
        params: {
          q: this.address,
          format: "json"
        }
      });
      const data = await JSON.parse(resp.data);
      if (data.length === 0) throw new Error(`No results found for address = \`${this.address}\`!`);
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      return [lat, lng];
    }
    throw new Error("No valid values for LocationInput!");
  }
}

export default LocationInput;