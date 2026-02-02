require('dotenv').config({ quiet: true })
const http = require("http")
const axios = require("axios")



const server = http.createServer(async (req, res) => {
    const location = getLocationFrom(req.url) ?? "Sonceboz"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}&units=metric&lang=fr`

    const response = await axios.get(url)

    const html = `
    <h1>Météo actuelle à ${location}</h1>
    <p>Température: ${response.data.main.temp}</p>
    <p>Description: ${response.data.weather[0].description}</p>
    `

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
});

const PORT = process.env.PORT || 3000

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

function getLocationFrom(url) {
    const parts = url.split("/")

    if (parts[1].split(".").length < 2 && parts[1].length > 0) {
        return parts[1]
    }


    return null;
}