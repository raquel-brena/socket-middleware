import net from "net";

const locationData = {
  A123: { latitude: 40.7128, longitude: -74.006 },
  B456: { latitude: 34.0522, longitude: -118.2437 },
  C789: { latitude: 51.5074, longitude: -0.1278 },
};

const port = 8080;

const serverInfo = {
  type: "register",
  service_name: "Transport Location Information Server",
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

     if (service === "location") {
      const location = locationData[param];
      if (location !== undefined) {
        response = `The location of bus ${param} is (${location.latitude}, ${location.longitude})`;
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
