import type jsPDF from "jspdf";

const PRIMARY: [number, number, number] = [31, 175, 139];
/** Approximates bg-primary/20 on the dark secondary header */
const LOGO_BG: [number, number, number] = [22, 100, 95];

type Point = [number, number];

function scaler(boxX: number, boxY: number, boxSize: number) {
  const pad = boxSize * 0.2;
  const inner = boxSize - pad * 2;
  const s = inner / 24;
  const ox = boxX + pad;
  const oy = boxY + pad;
  return (vx: number, vy: number): Point => [ox + vx * s, oy + vy * s];
}

function strokeLine(doc: jsPDF, from: Point, to: Point) {
  doc.line(from[0], from[1], to[0], to[1]);
}

/**
 * Draw the Building2-style logo used in the live preview header.
 * Matches Lucide Building2 icon on a rounded primary/20 background.
 */
export function drawPdfLogoIcon(
  doc: jsPDF,
  x: number,
  y: number,
  size: number
): void {
  // Rounded background box
  doc.setFillColor(...LOGO_BG);
  doc.roundedRect(x, y, size, size, 2.5, 2.5, "F");

  const map = scaler(x, y, size);
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.35);
  doc.setLineCap("round");
  doc.setLineJoin("round");

  // Main building body — M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z
  const [bx, by] = map(6, 2);
  const [bx2, by2] = map(18, 22);
  doc.roundedRect(bx, by, bx2 - bx, by2 - by, 0.6, 0.6, "S");

  // Left annex — M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2
  const [lx, ly] = map(2, 12);
  const [lx2, ly2] = map(6, 22);
  doc.roundedRect(lx, ly, lx2 - lx, ly2 - ly, 0.5, 0.5, "S");

  // Right annex — M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2
  const [rx, ry] = map(18, 9);
  const [rx2, ry2] = map(22, 22);
  doc.roundedRect(rx, ry, rx2 - rx, ry2 - ry, 0.5, 0.5, "S");

  // Floor lines — M10 6h4, M10 10h4, M10 14h4, M10 18h4
  for (const row of [6, 10, 14, 18]) {
    strokeLine(doc, map(10, row), map(14, row));
  }
}
