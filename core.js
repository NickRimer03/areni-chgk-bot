import app from "./src/app.js";

if (process.env.MODE !== "production") {
  (async () => {
    const [
      {
        default: { config },
      },
      path,
    ] = await Promise.all([import("dotenv"), import("path")]);

    config({ path: path.resolve() + "/.env" });
    app();
  })();
} else {
  app();
}
