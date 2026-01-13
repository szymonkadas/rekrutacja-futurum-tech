import { type ReactNode } from "react";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "/src/App.css";
import Dashboard from "./ui/app/dashboard/dashboard.page";
import EditCampaignPage from "./ui/app/campaign-view/edit/EditCampaign.page";
import CreateCampaignPage from "./ui/app/campaign-view/create/create-campaign.page";
import { routes, RoutePaths } from "./config/routes";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={RoutePaths.HOME} element={<Dashboard/>} />
        <Route
          path={RoutePaths.CREATE}
          element={
            <StandaloneLayout>
              <CreateCampaignPage />
            </StandaloneLayout>
          }
        />
        <Route
          path={RoutePaths.EDIT}
          element={
            <StandaloneLayout>
              <EditCampaignPage />
            </StandaloneLayout>
          }
        />
        <Route path={RoutePaths.EDIT_WITH_PARAM} element={<StandaloneEditRoute />} />
        <Route path="*" element={<Navigate to={routes.home()} replace />} />
      </Routes>
    </HashRouter>
  );
};



const StandaloneEditRoute = () => {
  const { campaignId } = useParams<{ campaignId?: string }>();
  return (
    <StandaloneLayout>
      <EditCampaignPage campaignId={campaignId} />
    </StandaloneLayout>
  );
};

const StandaloneLayout = ({ children }: { children: ReactNode }) => (
  <main className="single-pane">
    <div className="single-pane__back">
      <Link to={routes.home()}>← Back to workspace</Link>
    </div>
    {children}
  </main>
);

export default App;
