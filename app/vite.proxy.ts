export const proxy = {
  "/server": {
    target: "http://faraday-server-service:8000/",
    secure: false,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/server/, ""),
  },
};
