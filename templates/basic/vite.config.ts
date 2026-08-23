import { defineConfig } from "vite";
import { smoke } from "@n3rdw1z4rd/smoke-ui/vite-plugin";

export default defineConfig({
    plugins: [smoke()],
});
