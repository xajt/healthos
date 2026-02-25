// Re-export client for browser components
export { createClient as createBrowserClient } from "./client";

// Server client should be imported directly from "./server" in server components
// Do NOT export server client from here to avoid client component issues
