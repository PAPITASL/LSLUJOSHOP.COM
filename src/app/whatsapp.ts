export const WHATSAPP_VENDEDORES = [
  "573009492341",
  "573027047752",
  "573192382976",
] as const;

export function whatsappProducto(productId: number, message: string) {
  const index = Math.abs(productId - 1) % WHATSAPP_VENDEDORES.length;
  return `https://wa.me/${WHATSAPP_VENDEDORES[index]}?text=${message}`;
}
