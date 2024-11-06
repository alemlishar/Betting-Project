const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/services", "/transactions"], {
      //target: "http://localhost:8080",
       target: "http://10.29.33.40:32080", // integration
      secure: true,
      auth: "admin:admin",
      ws: true,
    }),
  );
};
