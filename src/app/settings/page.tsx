import { getAppConfig } from "@/lib/google-sheets";
import {
  addCategory,
  removeCategory,
  renameCategory,
  addCard,
  removeCard,
  addSummaryCard,
  removeSummaryCard,
  updateSummaryCard,
} from "@/lib/actions";
import { CARD_OWNER_COLORS } from "@/lib/utils";
import { CategoryList, CardList } from "@/components/category-list";
import { SummaryCardList } from "@/components/summary-card-list";
import { CreateVacationForm } from "@/components/create-vacation-form";

const cardGroups = [
  { key: "shared" as const, label: "משותף", color: CARD_OWNER_COLORS.shared },
  { key: "einor" as const, label: "עינור", color: CARD_OWNER_COLORS.einor },
  { key: "ziv" as const, label: "זיו", color: CARD_OWNER_COLORS.ziv },
];

export default async function SettingsPage() {
  const config = await getAppConfig();

  const cardData = {
    einor: config.cardsEinor,
    ziv: config.cardsZiv,
    shared: config.cardsShared,
  };

  return (
    <div className="container-fluid px-4 py-3">
      <h1 className="h4 fw-bold mb-4">הגדרות</h1>

      <CategoryList
        title="קטגוריות חודשיות"
        items={config.monthlyCategories}
        onAdd={async (name, color) => {
          "use server";
          await addCategory("monthly", name, color);
        }}
        onRemove={async (name) => {
          "use server";
          await removeCategory("monthly", name);
        }}
        onRename={async (oldName, newName) => {
          "use server";
          await renameCategory("monthly", oldName, newName);
        }}
        placeholder="קטגוריה חדשה..."
      />

      <CategoryList
        title="קטגוריות חופשה"
        items={config.vacationCategories}
        onAdd={async (name, color) => {
          "use server";
          await addCategory("vacation", name, color);
        }}
        onRemove={async (name) => {
          "use server";
          await removeCategory("vacation", name);
        }}
        onRename={async (oldName, newName) => {
          "use server";
          await renameCategory("vacation", oldName, newName);
        }}
        placeholder="קטגוריה חדשה..."
      />

      <div className="card rounded-3 border p-3 mb-4">
        <h3 className="h6 fw-bold mb-3">כרטיסי אשראי / אמצעי תשלום</h3>
        {cardGroups.map((group) => (
          <div key={group.key} className="mb-3">
            <div className="small fw-bold mb-2" style={{ color: group.color }}>
              {group.label}
            </div>
            <CardList
              title=""
              cardItems={cardData[group.key]}
              badgeColor={group.color}
              onAdd={async (name) => {
                "use server";
                await addCard(group.key, name);
              }}
              onRemove={async (name) => {
                "use server";
                await removeCard(group.key, name);
              }}
              placeholder={`אמצעי תשלום חדש...`}
            />
          </div>
        ))}
      </div>

      <SummaryCardList
        items={config.summaryCards}
        availableCategories={config.monthlyCategories.map((c) => c.name)}
        onAdd={async (label, categories) => {
          "use server";
          await addSummaryCard(label, categories);
        }}
        onRemove={async (label) => {
          "use server";
          await removeSummaryCard(label);
        }}
        onUpdate={async (oldLabel, newLabel, categories) => {
          "use server";
          await updateSummaryCard(oldLabel, newLabel, categories);
        }}
      />

      <CreateVacationForm />
    </div>
  );
}
