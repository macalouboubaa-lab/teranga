export type RideType = "standard" | "premium";

export function calculatePrice(distanceKm: number, rideType: RideType = "standard"): number {
  const base = rideType === "premium" ? 900 : 500;
  const perKm = rideType === "premium" ? 450 : 350;
  const min = rideType === "premium" ? 1400 : 1000;
  const total = base + distanceKm * perKm;
  return Math.max(Math.round(total / 50) * 50, min);
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0
  }).format(amount);
}
