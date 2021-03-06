import React, { useState, useEffect } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchForecast } from "../api/fetchForecast";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";

const ChartContainer = styled(ResponsiveContainer)`
  transform: translateX(-1.2rem);
`;

export const Chart = () => {
  const [forecastData, setForecastData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hours, setHours] = useState(0);
  const { zip } = useParams();

  const convert = (timestamp) => {
    const dateObj = new Date(timestamp * 1000);
    const hours = dateObj.getHours();
    return hours;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setHours(localStorage.getItem("hours"));
        const fetchedForecast = await fetchForecast(zip);
        const slicedForecast = fetchedForecast.energyPropForecast.slice(
          0,
          hours
        );
        const convertedForecast = slicedForecast.map((forecast) => ({
          time: convert(forecast.time),
          gsi: forecast.gsi,
        }));
        setForecastData(convertedForecast);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [zip, hours]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  return (
    <ChartContainer width={350} height={350}>
      <BarChart margin={{ bottom: 15 }} data={forecastData}>
        <XAxis
          label={{
            value: "[Uhrzeit h]",
            position: "insideBottomRight",
            dy: 13,
            dx: 0,

            fill: "white",
          }}
          dataKey="time"
          stroke="white"
        />
        <YAxis
          label={{
            value: "[Ökostromanteil %]",
            position: "insideTop",
            fill: "white",
            dy: 63,
            dx: -15,
            angle: -90,
          }}
          stroke="white"
        />

        <Bar dataKey="gsi">
          {forecastData.map((entry, index) => (
            <Cell
              fill={
                entry.gsi < 35 ? "red" : entry.gsi < 60 ? "#F4A321" : "#3D846D"
              }
              key={index}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default Chart;
