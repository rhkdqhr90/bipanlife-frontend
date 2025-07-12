"use client";

import dynamic from "next/dynamic";
import type { MapDisplayProps } from "./MapDisplay";

const DynamicMap = dynamic(() => import("./MapDisplay"), { ssr: false });

export const MapDisplayWrapper = (props: MapDisplayProps) => {
  return <DynamicMap {...props} />;
};
