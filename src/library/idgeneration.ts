let counter = 0;

export function generateId(): string {
  const prefix = "meme";
  const length = 30;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = prefix;

  for (let i = prefix.length; i < length; i++) {
    if (i % 6 === 0) {
      id += "-";
    }
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  counter++;
  return id + counter;
}