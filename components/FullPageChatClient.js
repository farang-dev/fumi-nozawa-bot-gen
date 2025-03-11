// components/FullPageChatClient.js
"use client"; // Add this line to mark this as a client-side component

import dynamic from "next/dynamic";

// Dynamically import FullPageChat and disable SSR
const FullPageChat = dynamic(() => import("flowise-embed-react").then((mod) => mod.FullPageChat), {
  ssr: false, // Disable server-side rendering
});

export default FullPageChat;
