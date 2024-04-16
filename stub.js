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
      service_name: "Servidor de informações de transporte" || servico,
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

  static async getBusFare(linha) {
    const client = new net.Socket();
  }
}
