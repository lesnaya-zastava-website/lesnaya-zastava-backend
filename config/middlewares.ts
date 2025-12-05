export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["https://leznaya-zastava.ydns.eu", "http://localhost:5174", "http://192.168.0.104:5174"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      headers: "*",
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
