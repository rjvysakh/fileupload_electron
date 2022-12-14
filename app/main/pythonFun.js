const { PythonShell } = require("python-shell");

exports.runPythonFile = () => {
  let pyshell = new PythonShell("script.py");

  pyshell.on("message", function (message) {
    console.log(message);
  });

  pyshell.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished");
  });
};
