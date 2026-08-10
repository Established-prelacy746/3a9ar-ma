"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Maximize2, Minimize2, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface VirtualTourViewerProps {
  imageUrl: string;
  title?: string;
}

export function VirtualTourViewer({ imageUrl, title }: VirtualTourViewerProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setRotation((prev) => ({
        x: Math.max(-30, Math.min(30, prev.x - dy * 0.3)),
        y: prev.y + dx * 0.3,
      }));
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      setRotation((prev) => ({
        x: Math.max(-30, Math.min(30, prev.x - dy * 0.3)),
        y: prev.y + dx * 0.3,
      }));
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    [isDragging],
  );

  const resetView = () => setRotation({ x: 0, y: 0 });

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <RotateCcw className="h-4 w-4 text-primary" />
          {t("virtualTourTitle")}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border bg-black"
        style={{ aspectRatio: "16/9", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="h-full w-full transition-transform duration-100"
          style={{
            transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.2)`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={imageUrl}
            alt={title ?? t("virtualTourAlt")}
            className="h-full w-full object-cover select-none"
            draggable={false}
          />
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white">
          <Info className="h-3 w-3" />
          {t("virtualTourHint")}
        </div>
      </div>
    </div>
  );
}
