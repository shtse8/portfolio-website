"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";
import { SHIPPED_PRODUCTS, type ShippedProduct } from "@/data/projects";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

type Filter = "All" | "Mobile Games" | "Web Apps" | "Tools & Utilities";

const FILTERS: Filter[] = [
  "All",
  "Mobile Games",
  "Web Apps",
  "Tools & Utilities",
];

/**
 * Complete shipped products catalog (games + web + tools with screenshots).
 * Click opens a fixed modal — grid cards never expand or reflow.
 */
export default function FeaturedProducts() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const products = useMemo(() => {
    if (filter === "All") return SHIPPED_PRODUCTS;
    return SHIPPED_PRODUCTS.filter((p) => p.category === filter);
  }, [filter]);

  const selected = selectedId
    ? (SHIPPED_PRODUCTS.find((p) => p.id === selectedId) ?? null)
    : null;

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: SHIPPED_PRODUCTS.length };
    for (const p of SHIPPED_PRODUCTS) {
      m[p.category] = (m[p.category] ?? 0) + 1;
    }
    return m;
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
    };
  }, [selected]);

  return (
    <div className="container-wide">
      <SectionHeader
        index="02b"
        eyebrow="Shipped products"
        title={`${SHIPPED_PRODUCTS.length} games and products with real screenshots.`}
        description="Full catalog from the gaming and product eras — not a short sample. Screenshots stay real; only framing is tuned. Click any card for the full intro."
      />

      <Reveal delay={0.05}>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const n = counts[f] ?? 0;
            if (f !== "All" && n === 0) return null;
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary"
                }`}
              >
                {f === "All" ? "All" : f}
                <span
                  className={`font-mono text-[10px] ${active ? "text-accent-contrast/70" : "text-text-tertiary"}`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            index={i}
            onOpen={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-8 text-sm text-text-tertiary">
          No products in this filter.
        </p>
      )}

      <AnimatePresence>
        {selected && (
          <ProductModal
            product={selected}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: ShippedProduct;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.18) }}
      className="card group overflow-hidden"
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
        aria-label={`Open ${product.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
          <Image
            src={product.image}
            alt={`${product.title} screenshot`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            style={
              product.objectPosition
                ? { objectPosition: product.objectPosition }
                : undefined
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
              {product.era}
            </div>
            <h3 className="mt-0.5 font-display text-base font-semibold text-white">
              {product.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-white/80">
              {product.description}
            </p>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: ShippedProduct;
  onClose: () => void;
}) {
  const titleId = useId();

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/75 backdrop-blur-md"
        aria-label="Close product detail"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] flex max-h-[min(92svh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-lg sm:rounded-3xl"
      >
        <div className="relative h-48 shrink-0 overflow-hidden sm:h-56">
          <Image
            src={product.image}
            alt={`${product.title} screenshot`}
            fill
            className="object-cover"
            style={
              product.objectPosition
                ? { objectPosition: product.objectPosition }
                : undefined
            }
            sizes="768px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-surface/85 text-text-secondary backdrop-blur-sm hover:text-text-primary"
            aria-label="Close"
          >
            <FaXmark className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
            {product.era} · {product.category}
          </div>
          <h3
            id={titleId}
            className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl"
          >
            {product.title}
          </h3>
          {product.role && (
            <p className="mt-1 text-sm text-text-tertiary">{product.role}</p>
          )}
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
            {product.description}
          </p>

          {product.details.length > 0 && (
            <ul className="mt-5 space-y-2">
              {product.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2.5 text-sm text-text-secondary"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {product.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          )}

          {(product.urls?.website ||
            product.urls?.appStore ||
            product.urls?.googlePlay ||
            product.urls?.repository) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {product.urls?.website && (
                <a
                  href={product.urls.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" /> Website
                </a>
              )}
              {product.urls?.appStore && (
                <a
                  href={product.urls.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" /> App Store
                </a>
              )}
              {product.urls?.googlePlay && (
                <a
                  href={product.urls.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" /> Google Play
                </a>
              )}
              {product.urls?.repository && (
                <a
                  href={product.urls.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" /> Repository
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
