import net from "net";

const localizacaoData = {
  A123: { latitude: 40.7128, longitude: -74.006 },
  B456: { latitude: 34.0522, longitude: -118.2437 },
  C789: { latitude: 51.5074, longitude: -0.1278 },
};

const port = 8080;

const serverInfo = {
  type: "register",
  service_name: "Servidor de informações de localizacao de transporte",
  address: `localhost:${port}`,
};

const client = new net.Socket();

client.connect(1337, "localhost", () => {
  console.log("Conectado ao middleware");
  client.write(`${JSON.stringify(serverInfo)}`);
  client.on("data", (data) => {
    console.log("Resposta do middleware:", data.toString().trim());
  });
  client.end();
});

client.on("close", () => {
  console.log("Conexão com middleware fechada");
});

const server = net.createServer((socket) => {
  console.log("Cliente conectado");

  socket.on("data", (data) => {
    const requestData = data.toString().trim().split(":");
    const service = requestData[0];
    const param = requestData[1];

    let response;

     if (service === "localizacao") {
      const location = localizacaoData[param];
      if (location !== undefined) {
        response = `A localização do ônibus ${param} é (${location.latitude}, ${location.longitude})`;
      } else {
        response = "Código de ônibus não encontrado";
      }
    } else {
      response = "Serviço não reconhecido";
    }

    socket.write(response + "\r\n");
  });

  socket.on("end", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(port, "localhost", () => {
  console.log(`Servidor TCP rodando em localhost:${port}`);
});
