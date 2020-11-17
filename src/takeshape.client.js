export { getImageUrl } from "@takeshape/routing";

export class Client {
  constructor(endpoint, token) {
    this.token = token;
    this.endpoint = endpoint;
  }
  async graphql(query, variables) {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    return await res.json();
  }
}

export default new Client(
  process.env.TAKESHAPE_ENDPOINT,
  process.env.TAKESHAPE_TOKEN
);
