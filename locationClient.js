import Stub from "./stub.js";

const questions = [
  "location:A123",
  "location:C789",
  "location:B456",
  "location:A153",
];

try {
  for (const question of questions) {
    console.log(await Stub.getBusFare("Transport Location Information Server",question));
  }
} catch (error) {
  console.error(error);
}