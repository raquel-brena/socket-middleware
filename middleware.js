import net from "net";

const services = {};

const validate = (request) => {
  switch (request.type) {
    case "register":
      return request.address && request.service_name;
    case "search":
      return request.service_name;
    default:
      return false;
  }
};

const registerService = (socket, address, name) => {
  services[name] = address;
  socket.write(JSON.stringify({ status: "success" }));
};

const searchService = (socket, name) => {
  const address = services[name];
  if (address) {
    socket.write(JSON.stringify({ status: "success", address: address }));
  } else {
    socket.write(
      JSON.stringify({ status: "error", message: "Service not found" })
    );
  }
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("recieved request", data.toString());
    const request = JSON.parse(data.toString());
    if (validate(request)) {
      switch (request.type) {
        case "register":
          registerService(socket, request.address, request.service_name);
          break;
        case "search":
          searchService(socket, request.service_name);
          break;
        default:
          socket.write(
            JSON.stringify({ status: "error", message: "Invalid request type" })
          );
      }
    } else {
      socket.write(
        JSON.stringify({ status: "error", message: "Invalid request" })
      );
    }
  });
});

server.listen(1337, () => {
  console.log("Server is running on port 1337");
});
