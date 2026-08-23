import type { Plugin } from "vite";

export function smoke(): Plugin {
    return {
        name: "smoke-ui",
        config() {
            return {
                oxc: {
                    jsx: {
                        importSource: "@n3rdw1z4rd/smoke-ui",
                    },
                },
            };
        },
    };
}
