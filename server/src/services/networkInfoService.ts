import { networkInterfaces } from "node:os";

export function getLanAddresses(): string[] {
  const nets = networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses;
}
