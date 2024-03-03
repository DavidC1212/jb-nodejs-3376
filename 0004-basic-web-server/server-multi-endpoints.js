const { createServer } = require('http');

const PORT = '8080';
const HOST = 'localhost'

const requestListener = function (req, res) {
    if (req.url === '/csv') {    
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", "attachment;filename=johnbryce.csv");
        res.writeHead(200);
        return res.end('id,name,age\n12345678,shahar,47');
    }

    if (req.url === '/json') {
        res.setHeader('Content-Type', 'application/json');
        const data = { schoolName: 'John Bryce' };
        res.writeHead(200);
        return res.end(JSON.stringify(data));
    }

    res.writeHead(404);
    return res.end("not found");
};

const server = createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
