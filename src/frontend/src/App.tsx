import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/context/ThemeContext";
import HomePage from "@/pages/HomePage";
import MatchesPage from "@/pages/MatchesPage";
import NewsListingPage from "@/pages/NewsListingPage";
import SingleArticlePage from "@/pages/SingleArticlePage";
import WinPage from "@/pages/WinPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: NewsListingPage,
});

const newsArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news/$id",
  component: SingleArticlePage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches",
  component: MatchesPage,
});

const winRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/win",
  component: WinPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  newsArticleRoute,
  matchesRoute,
  winRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
