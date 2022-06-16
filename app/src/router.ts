import { createRouter, createWebHashHistory } from "vue-router";
import { useStore } from "src/store";
import Default from "src/views/Default.vue";
import PageNotFound from "src/views/PageNotFound.vue";
import RegView from "src/views/RegView.vue";
import OpenView from "src/views/OpenView.vue";

const routes = [
  {
    name: "default",
    path: "/",
    component: Default,
  },
  {
    name: "reg",
    path: "/reg/:elementId",
    component: RegView,
    props: true,
  },
  {
    name: "open",
    path: "/open",
    component: OpenView,
  },
  {
    name: "404",
    path: "/:catchAll(.*)",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const store = useStore();

  // If the store hasn't been loaded try to load a file or reroute to the open page
  if (to.path != "/open" && !store.loaded) {
    let result: boolean;
    if (to.query?.data) {
      // Load the data file from the query
      result = await store.loadUrl(to.query.data as string);
    } else {
      // Otherwise try to load data.json
      result = await store.loadUrl("data.json");
    }

    if (!result) {
      return { name: "open" };
    }
  }

  // Check if the data query has changed and the store needs to be reloaded
  if (to.query?.data && store.url != to.query.data) {
    try {
      await store.loadUrl(to.query.data as string);
      return {
        name: "reg",
        params: { elementId: store.getFirstRegister() },
        query: { data: store.url },
      };
    } catch {
      return { name: "open" };
    }
  }

  // Go to the first register entry if store is loaded and at root
  if (to.path == "/" && store.loaded) {
    if (store.url) {
      return {
        name: "reg",
        params: { elementId: store.getFirstRegister() },
        query: { data: store.url },
      };
    } else {
      return {
        name: "reg",
        params: { elementId: store.getFirstRegister() },
      };
    }
  }

  return;
});

export default router;
