import app from "./src/app.js";

const devImport = [import("dotenv"), import("path")];

if (process.env.MODE !== "production") {
  (async () => {
    const [
      {
        default: { config },
      },
      path,
    ] = await Promise.all(devImport);

    config({ path: path.resolve() + "/.env" });
    app();
  })();
} else {
  app();
}
