import Stub from "./stub.js";
import net from "net";

const serverInfo = await Stub.getServerInfo("Servidor de informações de passagem de transporte");

const client = new net.Socket();

const perguntas = {
    passagem: "passagem:54",
}
client.connect(serverInfo.port, serverInfo.address, () => {
    console.log(serverInfo)
    client.write(perguntas.passagem);
    client.on('data', (data) => {
        console.log(data.toString().trim());
    });
    client.end();
});

client.on('close', () => {
    console.log('Conexão fechada');
});