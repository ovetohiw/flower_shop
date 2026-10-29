"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PickupPoint } from "@/lib/integrations/cdek";

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void;
      Map: new (
        el: HTMLElement,
        opts: { center: number[]; zoom: number; controls: string[] },
      ) => {
        geoObjects: { add: (obj: unknown) => void; removeAll: () => void };
        setCenter: (center: number[], zoom?: number) => void;
        destroy: () => void;
      };
      Placemark: new (
        coords: number[],
        props: { balloonContent: string },
        opts: { preset: string },
      ) => {
        events: { add: (name: string, cb: () => void) => void };
      };
    };
  }
}

type Props = {
  points: PickupPoint[];
  selectedCode: string | null;
  onSelect: (point: PickupPoint) => void;
};

function loadYmaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.ymaps) {
    return new Promise((resolve) => window.ymaps!.ready(() => resolve()));
  }
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("ymaps-script");
    if (existing) {
      existing.addEventListener("load", () => window.ymaps?.ready(() => resolve()));
      return;
    }
    const script = document.createElement("script");
    script.id = "ymaps-script";
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => window.ymaps?.ready(() => resolve());
    script.onerror = () => reject(new Error("Не удалось загрузить Яндекс.Карты"));
    document.head.appendChild(script);
  });
}

export function PickupMap({ points, selectedCode, onSelect }: Props) {
  const mapId = useId().replace(/:/g, "");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<{ destroy: () => void; geoObjects: { add: (o: unknown) => void; removeAll: () => void }; setCenter: (c: number[], z?: number) => void } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "";

  useEffect(() => {
    if (!apiKey) {
      setMapError("Ключ Яндекс.Карт не задан — выберите пункт из списка");
      return;
    }
    let cancelled = false;

    loadYmaps(apiKey)
      .then(() => {
        if (cancelled || !mapRef.current || !window.ymaps) return;
        const center = points[0] ? [points[0].lat, points[0].lng] : [55.75, 37.62];
        const map = new window.ymaps.Map(mapRef.current, {
          center,
          zoom: 11,
          controls: ["zoomControl"],
        });
        mapInstance.current = map;

        map.geoObjects.removeAll();
        for (const point of points) {
          const mark = new window.ymaps!.Placemark(
            [point.lat, point.lng],
            { balloonContent: `${point.name}<br/>${point.address}` },
            { preset: selectedCode === point.code ? "islands#redDotIcon" : "islands#darkGreenDotIcon" },
          );
          mark.events.add("click", () => onSelect(point));
          map.geoObjects.add(mark);
        }
      })
      .catch((err: Error) => setMapError(err.message));

    return () => {
      cancelled = true;
      mapInstance.current?.destroy();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, points.map((p) => p.code).join(",")]);

  useEffect(() => {
    const selected = points.find((p) => p.code === selectedCode);
    if (selected && mapInstance.current) {
      mapInstance.current.setCenter([selected.lat, selected.lng], 14);
    }
  }, [selectedCode, points]);

  return (
    <div className="space-y-3">
      <div
        id={mapId}
        ref={mapRef}
        className="h-72 w-full overflow-hidden rounded-2xl border border-line bg-bg-deep"
      />
      {mapError ? <p className="text-sm text-ink-muted">{mapError}</p> : null}
      <ul className="max-h-56 space-y-2 overflow-y-auto">
        {points.map((point) => (
          <li key={point.code}>
            <button
              type="button"
              onClick={() => onSelect(point)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                selectedCode === point.code
                  ? "border-leaf bg-bg-deep"
                  : "border-line bg-cream hover:border-leaf/50"
              }`}
            >
              <p className="font-medium text-ink">{point.name}</p>
              <p className="text-sm text-ink-muted">{point.address}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
