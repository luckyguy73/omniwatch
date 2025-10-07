import os from "os";
import type { NextConfig } from "next";

/**
 * Utility to detect your current LAN IPv4 address (non-internal)
 * Works for Wi-Fi or Ethernet — whichever is active.
 */
function getLocalExternalIp(): string {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "localhost";
}

// noinspection HttpUrlsUsage
const nextConfig: NextConfig = {
    allowedDevOrigins: [
        `http://${getLocalExternalIp()}:3000`,
        "http://localhost:3000",
    ],
};

export default nextConfig;
