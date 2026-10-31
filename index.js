
require("dotenv").config();

const { App } = require("@slack/bolt");

const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/krimmit-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});


app.command("/krimmit-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
      "Available Commands:\n" +
      "/krimmit-ping - Check bot latency\n" +
      "/krimmit-catfact - Get a cat fact\n" +
      "/krimmit-help - Show this help message"
  });
});


app.command("/krimmit-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/krimmit-roll", async ({ command, ack, respond }) => {
  await ack();

  const args = command.text.trim().split(/\s+/);

  let min = 1;
  let max = 6;

  if (command.text.trim() !== "") {
    min = Number(args[0]);
    max = Number(args[1]);

    if (
      args.length !== 2 ||
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min >= max
    ) {
      await respond("Usage: /krimmit-roll [minimum] [maximum]");
      return;
    }
  }

  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  await respond(`🎲 You rolled a ${result}!`);
});

(async () => {
  await app.start();
  console.log("Krimmit is running!");
})();
