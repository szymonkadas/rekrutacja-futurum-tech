import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCampaignsQuery } from "/src/application/hooks/campaigns/useCampaigns";
import type { CampaignFormInput } from "/src/application/schemas/campaignSchema";
import { routes } from "/src/config/routes";
import BalancePanel from "./balance-panel/balance-panel";
import CampaignList from "../campaign-list/campaign-list";
import CreateCampaignPage from "../campaign-view/create/create-campaign.page";
import EditCampaignPage from "../campaign-view/edit/EditCampaign.page";
import styles from "./dashboard.module.css";

/**
 * Dashboard component rendering the main application view.
 *
 * Displays a list of available campaigns and updates the selected campaign
 * when the list changes. Also provides links to create and edit campaigns.
 *
 * Uses React Query to fetch the list of campaigns. The component will also
 * update the selected campaign when the user picks a campaign from the list.
 * If the selected campaign no longer exists in the list, it will automatically
 * select the first campaign in the list.
 */
const Dashboard = () => {
  const { data, isPending, isError, error } = useCampaignsQuery();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [createDraft, setCreateDraft] = useState<
    CampaignFormInput | undefined
  >();
  const [editDrafts, setEditDrafts] = useState<
    Record<string, CampaignFormInput>
  >({});

  const handleSelectCampaign = (id: string) => {
    setSelectedCampaignId(id);
    setMode("edit");
  };

  const navigate = useNavigate();

  const handleOpenCreateStandalone = () => {
    navigate(routes.create(), {
      state: { draft: createDraft },
    });
  };

  const handleOpenEditStandalone = () => {
    if (!selectedCampaignId) return;
    navigate(routes.edit(selectedCampaignId), {
      state: {
        draft: editDrafts[selectedCampaignId],
        campaignId: selectedCampaignId,
      },
    });
  };

  const handleCreateDraftChange = (draft: CampaignFormInput) => {
    setCreateDraft(draft);
  };

  const handleEditDraftChange = (
    draft: CampaignFormInput,
    campaignId: string,
  ) => {
    setEditDrafts((prev) => ({ ...prev, [campaignId]: draft }));
  };

  useEffect(() => {
    if (data?.length) {
      if (!selectedCampaignId) {
        startTransition(() => setSelectedCampaignId(data[0].id));
        return;
      }

      const stillExists = data.some(
        (campaign) => campaign.id === selectedCampaignId,
      );
      if (!stillExists) {
        startTransition(() => setSelectedCampaignId(data[0].id));
      }
    } else if (selectedCampaignId) {
      startTransition(() => setSelectedCampaignId(null));
    }
  }, [data, selectedCampaignId]);

  return (
    <main className={styles.appShell}>
      <section className={styles.stack}>
        <header>
          <div className={styles.workspaceHeader__textContent}>
            <p className="eyebrow">Overview</p>
            <h1>Campaign workspace</h1>
            <p className="muted">
              React Query keeps every operation in sync. Pick a campaign to edit
              or start a fresh one below.
            </p>
            <div className={styles.workspaceMeta}>
              <div className={styles.workspaceLinks}>
                <button
                  type="button"
                  className={styles.ghostLink}
                  onClick={handleOpenCreateStandalone}
                >
                  Open create page
                </button>
                <button
                  type="button"
                  className={styles.ghostLink}
                  onClick={handleOpenEditStandalone}
                  disabled={!selectedCampaignId}
                >
                  Open edit page
                </button>
              </div>
              <div className={styles.modeSwitch}>
                <button
                  type="button"
                  className={
                    mode === "create"
                      ? `${styles.modeSwitchButton} ${styles.modeSwitchButton_active}`
                      : styles.modeSwitchButton
                  }
                  onClick={() => setMode("create")}
                >
                  Create
                </button>
                <button
                  type="button"
                  className={
                    mode === "edit"
                      ? `${styles.modeSwitchButton} ${styles.modeSwitchButton_active}`
                      : styles.modeSwitchButton
                  }
                  onClick={() => setMode("edit")}
                  disabled={!selectedCampaignId}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <BalancePanel />
        </header>
        <CampaignList
          campaigns={data}
          isPending={isPending}
          isError={isError}
          error={error}
          selectedCampaignId={selectedCampaignId}
          onSelect={handleSelectCampaign}
        />
      </section>

      <div className={styles.pageGrid}>
        {mode === "create" ? (
          <CreateCampaignPage
            showTabs={false}
            showStandaloneLink
            onOpenStandalone={handleOpenCreateStandalone}
            onDraftChange={handleCreateDraftChange}
          />
        ) : (
          <EditCampaignPage
            campaignId={selectedCampaignId ?? undefined}
            showTabs={false}
            showStandaloneLink
            onOpenStandalone={handleOpenEditStandalone}
            onDraftChange={handleEditDraftChange}
          />
        )}
      </div>
    </main>
  );
};

export default Dashboard;
