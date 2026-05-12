import arcjet, {shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

export const aj = arcjet({
  key: ARCJET_KEY,
  characteristics : ["ip.src"],
  rules: [
    
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, 
      interval: 10, 
      capacity: 10, 
    }),
    detectBot({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE", 
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    
  ],
});