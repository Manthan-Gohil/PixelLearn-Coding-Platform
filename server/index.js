const app = require("./app");
const { PORT } = require("./config/config");

app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║  PixelLearn API Server               ║
  ║  Running on port ${PORT}               ║
  ║  http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  `);
});
