// This file is used to configure the Netlify CLI
// https://docs.netlify.com/cli/get-started/

module.exports = {
  // Your site name
  name: "moodyss",

  // Your build command
  build: {
    command: "npm run build",
    publish: ".next",
    environment: {
      NEXT_USE_NETLIFY_EDGE: "true",
      NODE_VERSION: "18",
    },
  },

  // Your dev command
  dev: {
    command: "npm run dev",
    port: 8888,
    framework: "next",
  },
}

