import type { FontData } from "astro:assets";

function isWeightMatch(fontWeight: string, weight: number): boolean {
  if (fontWeight === String(weight)) return true;
  // 可变字体的权重是范围（如 "300 700"）
  const [min, max] = fontWeight.split(/\s+/).map(Number);
  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    weight >= min &&
    weight <= max
  );
}

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  for (const font of fonts) {
    if (
      typeof font.weight === "string" &&
      isWeightMatch(font.weight, weight) &&
      font.style === style
    ) {
      const src = font.src.find(file => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  return undefined;
}
