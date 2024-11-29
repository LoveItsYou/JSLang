const result = [];

console.log = function (...args) {
  result.push(JSON.stringify(args[0]));
};

self.addEventListener("message", (e) => {
  try {
    const { code } = e.data;

    eval(code); // Execute Code

    const codeStore = {};
    result.forEach((code, line) => (codeStore[line] = code));

    self.postMessage({
      execution: codeStore,
    });
  } catch (error) {
    self.postMessage({
      Error: error,
    });
  }
});
