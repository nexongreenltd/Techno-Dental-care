import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("dental_token") : null;
    if (!token) {
      throw redirect({
        to: "/auth",
        search: { mode: "login", redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
