const api_key = "a25ea366e83b5b6f59f6ab017cbe5945";

async function getApiResponse() {
  let location = document.getElementById("city").value;
  location =
    location[0].toLocaleUpperCase() + location.substr(1).toLocaleLowerCase();

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric&lang=fr`;

  try {
    const rep = await fetch(url);

    const data = await rep.json();

    document.getElementById("title").innerHTML = "Météo actuelle à " + location;
    document.getElementById("temp").innerHTML =
      "Température: " + data.main.temp;
    document.getElementById("desc").innerHTML =
      "Description: " + data.weather[0].description;

    await sendSearch(location, data.main.temp, data.weather[0].description);
    await getDbResponse();
  } catch (e) {
    console.error(e.message);
  }
}

async function getDbResponse() {
  let location = document.getElementById("city").value;
  location =
    location[0].toLocaleUpperCase() + location.substr(1).toLocaleLowerCase();

  const url = `/${location}`;

  try {
    const rep = await fetch(url);

    const data = await rep.json();

    document.getElementById("history").innerHTML = "";

    for (const loc of data) {
      const node = document.createElement("li");
      node.innerHTML = `${loc.title} - Température: ${loc.temperature}°C - Description: ${loc.description} - Timestamp: ${loc.timestamp}`;

      document.getElementById("history").appendChild(node);
    }
  } catch (e) {
    console.error(e.message);
  }
}

async function sendSearch(loc, temp, desc) {
  try {
    await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        location: loc,
        temp: temp,
        desc: desc,
      }),
    });
  } catch (e) {
    console.error(e.message);
  }
}

async function login(event) {
  console.log("Try to login");
  event.preventDefault();

  try {
    const email = document.querySelector("input[name=email]").value
    const password = document.querySelector("input[name=password]").value

    const rep = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (rep.ok) {
      const text = await rep.text()
      const data = JSON.parse(text)
      const token = data.token

      document.cookie = `Authorization=Bearer ${token}; path=/`;
      window.location.replace("/")
    }
  } catch (e) {
    console.error(e.message);
  }
}
