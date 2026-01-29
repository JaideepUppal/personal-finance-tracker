import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.js",
                "resources/js/**/*.js",
                "resources/js/*.js",
                "resources/css/**/*.css",
                "resources/css/*.css",
                "resources/css/pages/landing.css",
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
