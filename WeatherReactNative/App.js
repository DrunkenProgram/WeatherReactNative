import { getPermissionsAsync } from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "d85cf7db2ea4f6b3786070447cb8aed0";
const icons = {
    Rain: "rainy",
    Clear: "sunny",
    Thunderstorm: "thunderstorm",
    Drizzle: "cloud-drizzle",
    Snow: "snow",
    Smoke: "smoke",
    Haze: "day-haze",
    Fog: "weather-fog",
    Tornado: "weather-tornado",
    Clouds: "cloudy",
};
export default function App() {
    const [district, setDistrict] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setDistrict(location[0].district);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(json.daily);
    };
    useEffect(() => {
        getWeather();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{district}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator color="#000000" size="large" />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <Text style={styles.date}>
                                {new Date(day.dt * 1000)
                                    .toString()
                                    .substring(0, 10)}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.temp}>
                                    {parseFloat(day.temp.day).toFixed(1)}
                                </Text>
                                <Text>
                                    <Ionicons
                                        name={icons[day.weather[0].main]}
                                        size={70}
                                        color="black"
                                    />
                                </Text>
                            </View>
                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>

                            <Text style={styles.tinytext}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFD501",
    },
    city: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 68,
        fontWeight: "500",
    },
    date: {
        marginTop: 50,
        marginLeft: 20,
        fontSize: 40,
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
    },
    temp: {
        fontSize: 158,
        marginLeft: 20,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
        marginLeft: 20,
    },
    tinytext: {
        fontSize: 20,
        marginLeft: 20,
    },
});
