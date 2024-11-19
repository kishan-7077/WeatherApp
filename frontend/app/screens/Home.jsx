import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import Animated, {
	useSharedValue,
	useAnimatedProps,
	withTiming,
} from "react-native-reanimated";

const Home = ({ navigation }) => {
	const [city, setCity] = useState("");
	const [weatherData, setWeatherData] = useState(null);
	const animationProgress = useSharedValue(0);
	const animationRef = useRef(null);
	const [conditionSource, setConditionSource] = useState(
		require("../animations/thunderStorm.json")
	);
	const [animationKey, setAnimationKey] = useState(0);

	const fetchWeather = async () => {
		if (!city) {
			Alert.alert("Error", "Please enter a valid city name.");
			return;
		}

		try {
			const response = await axios.get(`http://192.168.1.11:5000/weather`, {
				params: { city },
				timeout: 10000,
			});
			animationRef.current.play(30, 70);
			updateAnimation(response.data.weather[0].description);
			setWeatherData(response.data);
			setCity("");
		} catch (error) {
			if (error.response) {
				console.error("Error Response:", error.response.data);
				Alert.alert("Error", error.response.data.message);
			} else if (error.request) {
				console.error("Error Request:", error.request);
				Alert.alert("Error", "Network error. Please try again.");
			} else {
				console.error("General Error:", error.message);
				Alert.alert("Error", error.message);
			}
		}
	};

	const updateAnimation = (condition) => {
		console.log(condition);

		switch (condition.toLowerCase()) {
			case "clear sky":
				setConditionSource(require("../animations/clearSky.json"));
				break;
			case "broken clouds":
				setConditionSource(require("../animations/brokenClouds.json"));
				break;
			case "few clouds":
				setConditionSource(require("../animations/fewClouds.json"));
				break;
			case "fog":
				setConditionSource(require("../animations/mist.json"));
				break;
			case "haze":
				setConditionSource(require("../animations/mist.json"));
				break;
			case "scattered clouds":
				setConditionSource(require("../animations/scatteredClouds.json"));
				break;
			case "moderate rain":
				setConditionSource(require("../animations/showerRain.json"));
				break;
			case "thunder storm":
				setConditionSource(require("../animations/thunderStorm.json"));
				break;
			default:
				setConditionSource(require("../animations/thunderStorm.json"));
				break;
		}
		setAnimationKey((prev) => prev + 1);
	};

	const handleFocus = () => {
		animationRef.current.play(0, 30);
	};

	const animatedProps = useAnimatedProps(() => ({
		progress: animationProgress.value,
	}));

	return (
		<View style={styles.container}>
			<View style={styles.animationContainer}>
				<TextInput
					style={styles.input}
					placeholder="Enter city"
					value={city}
					onChangeText={(text) => setCity(text)}
					onFocus={handleFocus}
				/>
				<LottieView
					source={require("../animations/search.json")}
					style={styles.animation}
					animatedProps={animatedProps}
					ref={animationRef}
					loop={false}
				/>
			</View>
			<Button title="Get Weather Data" onPress={fetchWeather} />
			{weatherData && (
				<View style={styles.card}>
					<Text style={styles.text}>City: {weatherData.name}</Text>
					<Text style={styles.text}>
						Temperature: {weatherData.main.temp}°C
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							padding: 5,
						}}
					>
						<Text style={styles.text}>
							Condition: {weatherData.weather[0].description}
						</Text>
						<LottieView
							key={animationKey}
							source={conditionSource}
							autoPlay
							loop
							style={{ width: 50, height: 50 }}
						/>
					</View>
					<Button
						title="Details"
						onPress={() => {
							animationRef.current.play(30, 70);
							navigation.navigate("Details", { weatherData });
						}}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#ADD8E6",
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 20,
		width: "100%",
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	animation: {
		width: 50,
		height: 50,
		marginBottom: 20,
	},
	animationContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 30,
		marginRight: 30,
	},
	card: {
		marginTop: 20,
		padding: 20,
		borderRadius: 10,
		backgroundColor: "#f0f0f0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
});

export default Home;
