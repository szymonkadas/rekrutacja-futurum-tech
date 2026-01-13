export const RoutePaths = {
  HOME: "/",
  CREATE: "/create",
  EDIT: "/edit",
  EDIT_WITH_PARAM: "/edit/:campaignId",
};

export const routes = {
  home: () => RoutePaths.HOME,
  create: () => RoutePaths.CREATE,
  edit: (id?: string) => (id ? `/edit/${id}` : RoutePaths.EDIT),
};

export default routes;
