"use client";

import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { MapCase } from "@/types/cases";

const markerIcon = L.divIcon({
  className: "rise-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

export function CasesMap({ cases }: { cases: MapCase[] }) {
  return (
    <MapContainer center={[-15, -60]} zoom={4} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cases.map((item) => (
        <Marker key={item.id} position={[item.latitude, item.longitude]} icon={markerIcon}>
          <Popup>
            <div className="max-w-56 space-y-2">
              {item.coverImageUrl ? (
                <Image
                  className="h-24 w-full rounded object-cover"
                  src={item.coverImageUrl}
                  alt=""
                  width={240}
                  height={120}
                  unoptimized
                />
              ) : null}
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs">{item.shortDescription}</p>
              <Link href={`/casos/${item.slug}`} className="text-xs font-semibold">
                Ver detalle
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
