const api_key = "a25ea366e83b5b6f59f6ab017cbe5945"

async function getApiResponse() {
    let location = document.getElementById("city").value
    location = location[0].toLocaleUpperCase() + location.substr(1).toLocaleLowerCase()

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric&lang=fr`

    try {
        const rep = await fetch(url)

        const data = await rep.json()

        document.getElementById("title").innerHTML = "Météo actuelle à " + location
        document.getElementById("temp").innerHTML = "Température: " + data.main.temp
        document.getElementById("desc").innerHTML = "Description: " + data.weather[0].description

        await getDbResponse()
        await sendSearch(location, data.main.temp, data.weather[0].description)

    } catch (e) {
        console.error(e.message);
    }
}

async function getDbResponse() {
    let location = document.getElementById("city").value
    location = location[0].toLocaleUpperCase() + location.substr(1).toLocaleLowerCase()

    const url = `/${location}`

    try {
        const rep = await fetch(url)

        const data = await rep.json()

        document.getElementById("history").innerHTML = ''

        for (const loc of data) {
            const node = document.createElement("li")
            node.innerHTML = `${loc.title} - Température: ${loc.temperature}°C - Description: ${loc.description} - Timestamp: ${loc.timestamp}`

            document.getElementById("history").appendChild(node)
        }

    } catch (e) {
        console.error(e.message);
    }
}

async function sendSearch(loc, temp, desc) {
    try {
        await fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                location: loc,
                temp: temp,
                desc: desc,
            })
        })

        console.log("Posted content");

    } catch (e) {
        console.error(e.message);

    }
}