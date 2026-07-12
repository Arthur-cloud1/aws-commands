// Import Node.js built-in HTTP module
// This gives us the tools to create a web server
const http = require('http');

// Define the hostname
// 0.0.0.0 means accept connections from any IP address (not just localhost)
const hostname = '0.0.0.0';

// Define the port the server will listen on
// Port 3000 is commonly used for development and testing
const port = 3000;

// Create the server
// req = request (what the visitor sends when they visit)
// res = response (what we send back to the visitor)
const server = http.createServer((req, res) => {
    // Send back an HTML response with styling
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Arthur's Server</title>
    <style>
        /* Dark background for the whole page */
        body {
            background-color: #0a0a0a;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        /* Green heading */
        h1 {
            color: #00ff88;
            font-size: 48px;
        }
        /* White paragraph text centered */
        p {
            color: #ffffff;
            font-size: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div>
        <h1>Hello from Arthur's Server 🚀</h1>
        <p>Running on AWS EC2 | Containerized with Docker</p>
    </div>
</body>
</html>
`);
});

// Start the server
// Listen for incoming connections on the defined port and hostname
// Prints a confirmation message to the terminal when the server starts
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
