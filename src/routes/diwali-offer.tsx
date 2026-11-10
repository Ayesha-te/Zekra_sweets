import { createFileRoute, redirect } from "@tanstack/react-router";

// The Diwali offer has ended. Old links (ads, emails, shared messages) go to the Welcome Back page.
export const Route = createFileRoute("/diwali-offer")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: `/welcome-back${location.searchStr || ""}`, statusCode: 302 });
  },
});
