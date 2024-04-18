import net from "net";

const passagemData = {
  54: 5.4,
  73: 7.2,
  46: 4.9,
};

const port = 8081;

const serverInfo = {
  type: "register",
  service_name: "Servidor de informações de passagem de transporte",
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

    if (service === "passagem") {
      const price = passagemData[param];
      if (price !== undefined) {
        response = `O preço da passagem da linha ${param} é $${price}`;
      } else {
        response = "Linha não encontrada";
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
