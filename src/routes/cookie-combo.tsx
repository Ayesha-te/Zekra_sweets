import { createFileRoute, redirect } from "@tanstack/react-router";

// The cookie combo offer has ended. Old links go to the products page.
export const Route = createFileRoute("/cookie-combo")({
  beforeLoad: () => {
    throw redirect({ href: "/products", statusCode: 302 });
  },
});
