import Stub from "./stub.js";
import net from "net";

const serverInfo = await Stub.getServerInfo("Servidor de informações de localizacao de transporte");

const client = new net.Socket();
const perguntas = {
    localizacao: "localizacao:A123",
}

client.connect(serverInfo.port, serverInfo.address, () => {
    client.write(perguntas.localizacao);
    client.on('data', (data) => {
        console.log(data.toString().trim());
    });
    client.end();
});

client.on('close', () => {
    console.log('Conexão fechada');
});