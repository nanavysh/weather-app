// server.js
const jsonServer = require('json-server');
const json5 = require('json5');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'db.json5');
const data = json5.parse(fs.readFileSync(filePath, 'utf8'));

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
    console.log(`Resources:`);
    Object.keys(data).forEach(resource => {
        console.log(`  http://localhost:${port}/${resource}`);
    });
});