import net from "net";

const ticketData  = {
  54: 5.4,
  73: 7.2,
  46: 4.9,
};

const port = 8081;

const serverInfo = {
  type: "register",
  service_name: "Transport Ticket Information Server",
  address: `localhost:${port}`,
};

const client = new net.Socket();

client.connect(1337, "localhost", () => {
  console.log("Connected to middleware");
  client.write(`${JSON.stringify(serverInfo)}`);
  client.on("data", (data) => {
    console.log("Middleware response:", data.toString().trim());
  });
  client.end();
});

client.on("close", () => {
  console.log("Connection with middleware closed");
});

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    const requestData = data.toString().trim().split(":");
    const service = requestData[0];
    const param = requestData[1];

    let response;

    if (service === "ticket") {
      const price = ticketData[param];
      if (price !== undefined) {
        response = `The ticket price for line ${param} is ${price}`;
      } else {
        response = "Bus code not found";
      }
    } else {
      response = "Service not recognized";
    }

    socket.write(response + "\r\n");
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, "localhost", () => {
  console.log(`TCP server running on localhost:${port}`);
});
