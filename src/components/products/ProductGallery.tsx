"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
        <Image
          src={images[activeImage]}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, index) => (
            <button
              key={img}
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                activeImage === index ? "border-secondary" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${name} thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}