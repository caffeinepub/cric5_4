import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { FantasyProvider } from "@/context/FantasyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import HomePage from "@/pages/HomePage";
import MatchDetailPage from "@/pages/MatchDetailPage";
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

const matchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches/$id",
  component: MatchDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  newsArticleRoute,
  matchesRoute,
  matchDetailRoute,
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
      <AuthProvider>
        <FantasyProvider>
          <RouterProvider router={router} />
        </FantasyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
