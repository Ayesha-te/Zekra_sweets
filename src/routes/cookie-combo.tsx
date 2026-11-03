import { createFileRoute, redirect } from "@tanstack/react-router";

// The cookie combo offer has ended. Old links (ads, shared messages) go to the Diwali offer page.
export const Route = createFileRoute("/cookie-combo")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/diwali-offer${location.searchStr || ""}`, statusCode: 302 });
  },
});
