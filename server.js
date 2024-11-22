const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { connectToDatabase } = require("./src/lib/dbConnect"); // Correct the path
const RealtimeModel = require("./src/model/realtime"); // Import your Mongoose model

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  // Connect to the database when starting the server
  connectToDatabase();

  // When a client connects to Socket.io
  io.on("connection", (socket) => {
    console.log("A client connected");

    // Fetch initial chart data when a client connects
    async function fetchInitialData() {
      try {
        const data = await RealtimeModel.find(); // Use Mongoose model to fetch data
        socket.emit("initial-data", data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }

    fetchInitialData();

    // Listen for changes to the collection and emit updated data to clients
    async function listenForChanges() {
      try {
        // Watch for changes in MongoDB collection
        const changeStream = RealtimeModel.watch(); // Mongoose `watch` for change streams
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

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  // Start the server
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
