import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { TabDefinition } from "../types/TabDefinition";
import style from "./campaignPageTemplate.module.css";

type CampaignViewPageTemplateProps = {
  title: string;
  description?: string;
  tabs?: TabDefinition[];
  children: ReactNode;
  headerAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

const CampaignViewPageTemplate = ({
  title,
  description,
  tabs = [],
  headerAction,
  children,
}: CampaignViewPageTemplateProps) => {
  return (
    <section className={style.campaignPage}>
      <header className={style.campaignPage__header}>
        <div>
          <p className="eyebrow">Campaigns</p>
          <h2>{title}</h2>
          {description && <p className="muted">{description}</p>}
        </div>
        {(tabs.length > 0 || headerAction) && (
          <div className={style.campaignPage__headerMeta}>
            {headerAction && (
              <button
                type="button"
                className={style.headerActionButton}
                onClick={headerAction.onClick}
                disabled={headerAction.disabled}
              >
                {headerAction.label}
              </button>
            )}
            {tabs.length > 0 && (
              <nav className={style.tabNav} aria-label="Campaign form views">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    className={
                      tab.isActive
                        ? `${style.tabNav__item} ${style.tabNav__item_active}`
                        : style.tabNav__item
                    }
                    to={tab.to}
                    aria-current={tab.isActive ? "page" : undefined}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        )}
      </header>
      <div className={style.campaignPage__content}>{children}</div>
    </section>
  );
};

export default CampaignViewPageTemplate;
