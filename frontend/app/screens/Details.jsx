import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

const Details = ({ route }) => {
	const [forecastData, setForecastData] = useState(null);
	const { weatherData } = route.params;

	useEffect(() => {
		const fetchForecast = async () => {
			try {
				const response = await axios.get(
					`https://weatherapp-c2a2.onrender.com/forecast`,
					{
						params: { city: weatherData.name },
					}
				);
				setForecastData(response.data);
			} catch (error) {
				console.error("Error fetching forecast data:", error);
			}
		};

		fetchForecast();
	}, [weatherData.name]);

	// Function to format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.heading}>Current Weather</Text>
			<View style={styles.currentWeather}>
				<Text style={styles.text}>Temperature: {weatherData.main.temp}°C</Text>
				<Text style={styles.text}>
					Condition: {weatherData.weather[0].description}
				</Text>
				<Text style={styles.text}>Humidity: {weatherData.main.humidity}%</Text>
				<Text style={styles.text}>
					Wind Speed: {weatherData.wind.speed} m/s
				</Text>
			</View>

			{forecastData && (
				<>
					<Text style={styles.heading}>5-Day Forecast</Text>
					{forecastData.map((day, index) => (
						<View key={index} style={styles.forecastItem}>
							<Text style={styles.text}>
								Day {index + 1}: {formatDate(day.date)}
							</Text>
							<Text style={styles.text}>Condition: {day.condition}</Text>
							<Text style={styles.text}>Temperature: {day.temp}°C</Text>
						</View>
					))}
				</>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#F5F5F5",
	},
	heading: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	currentWeather: {
		backgroundColor: "#E0F7FA",
		padding: 20,
		borderRadius: 10,
		marginBottom: 20,
		width: "100%",
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
		color: "#555",
	},
	forecastItem: {
		backgroundColor: "#FFF",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
		borderLeftWidth: 5,
		borderColor: "#4CAF50",
	},
});

export default Details;
