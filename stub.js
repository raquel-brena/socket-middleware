import net from "net";

export default class Stub {
  static #_middleware = "localhost";
  static #_middlewarePort = 1337;

  constructor() {
    this._stub = true;
  }

  static async getServerInfo(servico) {
    const serverInfo = {
      type: "search",
      service_name: servico,
    };

    const client = new net.Socket();

    return new Promise((resolve, reject) => {
      client.connect(this.#_middlewarePort, this.#_middleware, () => {
        client.write(JSON.stringify(serverInfo));
        client.on("data", (data) => {
          const { address: uri } = JSON.parse(data);
          const [address, port] = uri.split(":");
          client.end();
          resolve({ address, port });
        });
        client.on("error", (error) => {
          reject(error);
        });
      });
    });
  }

  static async getInformation(service, question) {
    const client = new net.Socket();

    return new Promise(async (resolve, reject) => {
      const { address, port } = await this.getServerInfo(service);

      client.connect(port, address, () => {
        client.write(question);

        client.on("data", (data) => {
          const response = data.toString().trim();
          resolve(response);

          client.on("error", (error) => {
            reject(error);
          });
        });
      });

      client.on("close", () => {
        console.log("Connection closed");
      });
    });
  }
}
