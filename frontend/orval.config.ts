import { defineConfig } from "orval";

const openApiTarget =
  process.env.ORVAL_OPENAPI_URL?.trim() || "http://localhost:3000/swagger/json";

export default defineConfig({
  boards: {
    input: {
      target: openApiTarget,
    },
    output: {
      mode: "tags-split",
      target: "src/lib/api/generated",
      client: "react-query",
      clean: true,
      prettier: true,
    },
  },
});
