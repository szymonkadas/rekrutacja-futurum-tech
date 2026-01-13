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
// import CreateCampaignPage from "/src/ui/app/campaign-view/create/create-campaign.page";
// import EditCampaignPage from "/src/ui/app/campaign-view/edit/EditCampaign.page";
// import Dashboard from "./ui/app/dashboard/dashboard.page";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* <Route path="/" element={<Dashboard/>} /> */}
        <Route
          path="/create"
          element={
            <StandaloneLayout>
              {/* <CreateCampaignPage /> */}
              <></>
            </StandaloneLayout>
          }
        />
        <Route
          path="/edit"
          element={
            <StandaloneLayout>
              {/* <EditCampaignPage /> */}
              <></>
            </StandaloneLayout>
          }
        />
        {/* <Route path="/edit/:campaignId" element={<StandaloneEditRoute />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};



const StandaloneEditRoute = () => {
  const { campaignId } = useParams<{ campaignId?: string }>();
  return (
    <StandaloneLayout>
      {/* <EditCampaignPage campaignId={campaignId} /> */}
    </StandaloneLayout>
  );
};

const StandaloneLayout = ({ children }: { children: ReactNode }) => (
  <main className="single-pane">
    <div className="single-pane__back">
      <Link to="/">← Back to workspace</Link>
    </div>
    {children}
  </main>
);

export default App;
