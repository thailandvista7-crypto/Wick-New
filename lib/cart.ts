export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  variant?: string; // e.g., "Sensitive", "Strong", etc.
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingItem = cart.find((i) => i.productId === item.productId);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter((item) => item.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartQuantity(productId: string, quantity: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
}

export function clearCart(): void {
  localStorage.removeItem('cart');
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

export function getShippingCost(subtotal: number): number {
  const FREE_SHIPPING_THRESHOLD = 60;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
}

export function getRemainingForFreeShipping(subtotal: number): number {
  const FREE_SHIPPING_THRESHOLD = 60;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  return remaining > 0 ? remaining : 0;
}
