const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { connectToDatabase } = require("./src/lib/dbConnect");
const { RealtimeModel } = require("./src/model/realtime");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  connectToDatabase();

  io.on("connection", (socket) => {
    console.log("A client connected");

    async function fetchInitialData() {
      try {
        const data = await RealtimeModel.find();
        socket.emit("initial-data", data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }

    fetchInitialData();

    async function listenForChanges() {
      try {
        const changeStream = RealtimeModel.watch();
        changeStream.on("change", (change) => {
          if (change.operationType === "insert") {
            socket.emit("update-chart", change.fullDocument);
          }
        });
      } catch (error) {
        console.error("Error watching for changes:", error);
      }
    }

    listenForChanges();

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
