const net = require("net");

const services = {};

const validate = (request) => {
  return request.address && request.service_name;
};

const registerService = (request) => {
  if (services[request.address]) {
    console.log("Service already registered");
  } else {
    services[request.address] = request.service_name;
  }
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(Date.now(), data.toString());
    const request = JSON.parse(data.toString());
    if (validate(request)) {
      registerService(request);
      socket.write(JSON.stringify({ status: "success" }));
    } else {
      socket.write(JSON.stringify({ status: "error" }));
    }
  });
});

server.listen(1337, () => {
  console.log("Server is running on port 3000");
});
