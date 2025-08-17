import { Request, Response } from "express";
import { Ollama } from "ollama";
import { sys } from "../constans";
import { mapsDirectionsUrl, placesNearbySearch } from "../helpers";

export const getChat = async (req: Request, res: Response) => {
  try {
    const API_KEY = process.env.GMAP_KEY;
    const message = req.body.message;
    const lat = req.body.lat;
    const lng = req.body.lng;

    const ollama = new Ollama();
    const response = await ollama.chat({
      model: "llama3.2",
      messages: [
        { role: "system", content: sys.trim() },
        {
          role: "user",
          content: message,
        },
      ],
    });

    let parsed: {
      intent: "search_nearby" | "directions";
      category: string | null;
      destination: string | null;
      city: string | null;
    };

    try {
      parsed = JSON.parse(response.message.content);
    } catch (error) {
      parsed = {
        intent: "search_nearby",
        category: message.toLowerCase(),
        destination: null,
        city: "surabaya",
      };
    }

    if (parsed.intent !== "search_nearby" && parsed.intent !== "directions") {
      return res
        .status(400)
        .json({ success: false, message: "input not valid!" });
    }

    if (parsed.intent === "directions" && parsed.destination !== null) {
      const getDirection = mapsDirectionsUrl(parsed.destination, {
        lat: lat,
        lng: lng,
      });

      const data = [{ name: parsed.destination, link: getDirection }];

      return res.status(200).json({ success: true, data: data });
    }

    if (parsed.intent === "search_nearby" && parsed.category !== null) {
      const getDirection = await placesNearbySearch({
        lat: lat,
        lng: lng,
        keyword: parsed.category,
      });

      const data = getDirection.results.map((item: { [k: string]: any }) => {
        return {
          name: item.name,
          link: item.maps_url,
        };
      });

      return res.status(200).json({ success: true, data: data });
    }
  } catch (error) {
    console.log(error);
  }
};

//-8.2662016006134875, 114.7254445
