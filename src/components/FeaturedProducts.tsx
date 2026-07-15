"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

/**
 * Shipped product strip — real game screenshots from the Cubeage / MiniMax era.
 * Complements the live OSS WorkGraph with tangible product craft.
 */

type Product = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  era: string;
};

const PRODUCTS: Product[] = [
  {
    id: "fun-mahjong",
    title: "Fun Mahjong 16",
    blurb: "Taiwan 16-tile mahjong · 1M+ downloads",
    image: "/projects/fun-mahjong-16-tiles/1.jpg",
    era: "Cubeage",
  },
  {
    id: "big2-tycoon",
    title: "Big2 Tycoon",
    blurb: "Competitive Big Two with progression",
    image: "/projects/big2-tycoon/1.jpg",
    era: "Cubeage",
  },
  {
    id: "fun-texas",
    title: "Fun Texas Hold'em",
    blurb: "Social poker at Facebook scale",
    image: "/projects/fun-texas-holdem/1.png",
    era: "MiniMax",
  },
  {
    id: "landlord",
    title: "Landlord",
    blurb: "Fast-paced multiplayer card game",
    image: "/projects/landlord/1.png",
    era: "MiniMax",
  },
  {
    id: "fmj",
    title: "FMJ",
    blurb: "Flagship mahjong franchise moment",
    image: "/projects/fmj.jpeg",
    era: "Cubeage",
  },
  {
    id: "nakuz",
    title: "Nakuz",
    blurb: "HK gaming portal · 500K+ users",
    image: "/projects/nakuz/1.jpg",
    era: "Nakuz",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="container-wide">
      <SectionHeader
        index="02b"
        eyebrow="Also shipped"
        title="Games and products that hit real users."
        description="Selected titles from the gaming eras — real screenshots from the products, not placeholders."
      />

      <Reveal delay={0.06}>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 pt-1 hide-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.2) }}
              className="card group w-[min(80vw,320px)] shrink-0 overflow-hidden sm:w-auto"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                <Image
                  src={p.image}
                  alt={`${p.title} product screenshot`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 80vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                    {p.era}
                  </div>
                  <h3 className="mt-0.5 font-display text-base font-semibold text-text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-text-secondary">
                    {p.blurb}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
