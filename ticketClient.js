import Stub from "./stub.js";

const questions = [
    "ticket:54",
    "ticket:44",
    "ticket:46",
    "ticket:73"
]

try {
    for (const question of questions) {
        console.log(await Stub.getInformation("Transport Ticket Information Server", question))
    }
} catch (error) {
    console.error(error);
}