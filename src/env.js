(function(window) {
  window.__env = window.__env || {};

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = false;
  window.__env.envFileLoaded = true;

  window.__env.dbBaseUrl = 'http://127.0.0.1:5984/';
  window.__env.dbName = 'crmoon';

  window.__env.uploadUrl = 'http://localhost:4000/api/upload';
  window.__env.apiUrl = 'http://localhost:4000';

  window.__env.uploadDir = './src/assets/uploads/';
  window.__env.uploadRoot = './src/';

  // ng build --prod --base-href ./
})(this);

// sudo lsof -i :4000
// node server.js </dev/null &>/dev/null &
// ps -A
// ng serve --port 8085 --host 116.203.220.19 </dev/null &>/dev/null &

// http-server . -p 8085 </dev/null &>/dev/null &^
