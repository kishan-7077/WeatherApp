require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.get("/weather", async (req, res) => {
	const { city } = req.query;
	try {
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
		);
		console.log(response.data);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching weather data" });
	}
});

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
app.get("/forecast", async (req, res) => {
	const { city } = req.query;
	if (!city) {
		return res.status(400).json({ error: "City is required" });
	}
	try {
		const response = await axios.get(WEATHER_API_URL, {
			params: { q: city, appid: API_KEY, units: "metric" },
		});

		const forecastData = [];
		const dateSet = new Set();

		for (const item of response.data.list) {
			const date = item.dt_txt.split(" ")[0]; // Extract the date part

			if (!dateSet.has(date)) {
				dateSet.add(date);
				forecastData.push({
					date: date,
					condition: item.weather[0].description,
					temp: item.main.temp,
				});

				if (forecastData.length === 5) break; // We need only 5 days' data
			}
		}

		res.json(forecastData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error fetching forecast data" });
	}
});

app.get("/", (req, res) => {
	res.json({ message: "hello" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
