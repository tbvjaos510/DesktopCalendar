module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-use-v-if-with-v-for": "off",
    "vue/no-parsing-error": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
