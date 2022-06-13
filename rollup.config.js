const version = "1.0.0";
export default {
  input: "src/main.js",
  output: {
    file:
      process.env.NODE_ENV === "prod"
        ? `dist/proton-web-sdk-${version}.js`
        : `dist/proton-web-sdk-dev.js`,
    format: "iife",
  },
};
