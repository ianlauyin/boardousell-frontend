import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import axios from "axios";
import { useEffect, useState } from "react";
const mapApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
type center = {
  lat: number;
  lng: number;
} | null;

type props = {
  location: string;
  setError?: Function;
  setErrMsg?: Function;
  setPreview?: Function;
};

export default function GoogleMap({
  location,
  setError,
  setErrMsg,
  setPreview,
}: props): JSX.Element {
  const [center, setCenter] = useState<center>(null);

  useEffect(() => {
    const getCenter = async () => {
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${mapApiKey}`
        );
        setCenter({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        });
      } catch (error) {
        if (setError) {
          setError({
            backHome: false,
            message: "Oh. Somethings went wrong. Cannot load map",
          });
        } else if (setErrMsg && setPreview) {
          setErrMsg("Please enter correct location.");
          setPreview(null);
        }
      }
    };
    getCenter();
  });
  return (
    <APIProvider apiKey={mapApiKey ? mapApiKey : ""}>
      <Map center={center} zoom={16} className="google-map">
        <Marker position={center} />
      </Map>
    </APIProvider>
  );
}
