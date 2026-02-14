import { getAppConfig, getStockConfig } from "@/lib/google-sheets";
import {
  addCategory,
  removeCategory,
  renameCategory,
  addCard,
  removeCard,
  addSummaryCard,
  removeSummaryCard,
  updateSummaryCard,
  addRecurring,
  updateRecurring,
  removeRecurring,
  reorderRecurring,
  addCategoryMappingAction,
  updateCategoryMappingAction,
  removeCategoryMappingAction,
  addExpenseRenameRuleAction,
  updateExpenseRenameRuleAction,
  removeExpenseRenameRuleAction,
  addIncome,
  updateIncome,
  removeIncome,
  addStock,
  updateStock,
  removeStock,
  addBroker,
  updateBroker,
  removeBroker,
  addGoal,
  updateGoal,
  removeGoal,
} from "@/lib/actions";
import {
  CARD_OWNER_COLORS,
  buildCardsWithOwner,
  buildCategoryColorMap,
} from "@/lib/utils";
import { CategoryList, CardList } from "@/components/category-list";
import { SummaryCardList } from "@/components/summary-card-list";
import { CollapsibleSection } from "@/components/collapsible-section";
import { RecurringExpenseList } from "@/components/recurring-expense-list";
import { CategoryMappingList } from "@/components/category-mapping-list";
import { ExpenseRenameRuleList } from "@/components/expense-rename-rule-list";
import { IncomeSourceList } from "@/components/income-source-list";
import { StockDefinitionList } from "@/components/stock-definition-list";
import { BrokerList } from "@/components/broker-list";
import { StockGoalList } from "@/components/stock-goal-list";

const cardGroups = [
  { key: "shared" as const, label: "משותף", color: CARD_OWNER_COLORS.shared },
  { key: "einor" as const, label: "עינור", color: CARD_OWNER_COLORS.einor },
  { key: "ziv" as const, label: "זיו", color: CARD_OWNER_COLORS.ziv },
];

export default async function SettingsPage() {
  const [config, stockConfig] = await Promise.all([
    getAppConfig(),
    getStockConfig(),
  ]);

  const cardData = {
    einor: config.cardsEinor,
    ziv: config.cardsZiv,
    shared: config.cardsShared,
  };

  const categoryColorMap = buildCategoryColorMap(config.monthlyCategories);
  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-1">הגדרות</h1>
        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
          ניהול קטגוריות, אמצעי תשלום, ואוטומציות
        </p>
      </div>

      {/* ── Categories & Payment Methods ── */}
      <div className="settings-group">
        <div className="settings-group-header">
          <span
            className="settings-group-icon"
            role="img"
            aria-label="קטגוריות"
          >
            &#128278;
          </span>
          <span className="settings-group-title">קטגוריות ואמצעי תשלום</span>
        </div>

        <CollapsibleSection
          title="מקורות הכנסה"
          icon="&#128176;"
          description="הכנסות חודשיות שנוספות אוטומטית לגיליון חדש"
          accentColor="#0d6efd"
        >
          <IncomeSourceList
            items={config.incomeSources}
            onAdd={async (name, amount) => {
              "use server";
              await addIncome(name, amount);
            }}
            onUpdate={async (oldName, name, amount) => {
              "use server";
              await updateIncome(oldName, name, amount);
            }}
            onRemove={async (name) => {
              "use server";
              await removeIncome(name);
            }}
          />
        </CollapsibleSection>

        <div className="settings-group-grid">
          <div>
            <CollapsibleSection
              title="קטגוריות חודשיות"
              icon="&#127991;"
              description="קטגוריות להוצאות חודשיות רגילות"
              accentColor="#0d6efd"
            >
              <CategoryList
                title=""
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
            </CollapsibleSection>

            <CollapsibleSection
              title="קטגוריות חופשה"
              icon="&#127796;"
              description="קטגוריות להוצאות בזמן חופשות"
              accentColor="#0d6efd"
            >
              <CategoryList
                title=""
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
            </CollapsibleSection>
          </div>

          <div>
            <CollapsibleSection
              title="אמצעי תשלום"
              icon="&#128179;"
              description="כרטיסי אשראי וחשבונות"
              accentColor="#0d6efd"
            >
              {cardGroups.map((group) => (
                <div key={group.key} className="mb-3">
                  <div
                    className="small fw-bold mb-2"
                    style={{ color: group.color }}
                  >
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
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* ── Dashboard Config ── */}
      <div className="settings-group">
        <div className="settings-group-header">
          <span className="settings-group-icon" role="img" aria-label="דשבורד">
            &#128202;
          </span>
          <span className="settings-group-title">תצוגת דשבורד</span>
        </div>

        <CollapsibleSection
          title="כרטיסי סיכום"
          icon="&#128202;"
          description="הגדרת הכרטיסים המוצגים בראש הדף החודשי"
          accentColor="#6f42c1"
        >
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
        </CollapsibleSection>
      </div>

      {/* ── Automation ── */}
      <div className="settings-group">
        <div className="settings-group-header">
          <span
            className="settings-group-icon"
            role="img"
            aria-label="אוטומציה"
          >
            &#9881;
          </span>
          <span className="settings-group-title">אוטומציות וכללים</span>
        </div>

        <CollapsibleSection
          title="הוצאות קבועות"
          icon="&#128260;"
          description="הוצאות שחוזרות כל חודש ונוספות אוטומטית"
          accentColor="#198754"
        >
          <RecurringExpenseList
            items={config.recurringExpenses}
            categories={config.monthlyCategories.map((c) => c.name)}
            categoryColorMap={categoryColorMap}
            cards={allCards}
            cardColorMap={cardColorMap}
            onAdd={async (
              name,
              amount,
              category,
              card,
              keywords,
              tentative,
            ) => {
              "use server";
              await addRecurring(
                name,
                amount,
                category,
                card,
                keywords,
                tentative,
              );
            }}
            onUpdate={async (
              oldName,
              name,
              amount,
              category,
              card,
              keywords,
              tentative,
            ) => {
              "use server";
              await updateRecurring(
                oldName,
                name,
                amount,
                category,
                card,
                keywords,
                tentative,
              );
            }}
            onRemove={async (name) => {
              "use server";
              await removeRecurring(name);
            }}
            onReorder={async (items) => {
              "use server";
              await reorderRecurring(items);
            }}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="מיפוי הוצאות לקטגוריות"
          icon="&#128279;"
          description="שיוך אוטומטי של הוצאות לקטגוריות לפי שם"
          accentColor="#198754"
        >
          <CategoryMappingList
            items={config.categoryMappings}
            categories={config.monthlyCategories.map((c) => c.name)}
            categoryColorMap={categoryColorMap}
            onAdd={async (expenseNames, category) => {
              "use server";
              await addCategoryMappingAction(expenseNames, category);
            }}
            onUpdate={async (oldExpenseName, expenseName, category) => {
              "use server";
              await updateCategoryMappingAction(
                oldExpenseName,
                expenseName,
                category,
              );
            }}
            onRemove={async (expenseName) => {
              "use server";
              await removeCategoryMappingAction(expenseName);
            }}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="כללי שינוי שם בייבוא"
          icon="&#9999;"
          description="שינוי שמות הוצאות אוטומטית בעת ייבוא מאקסל"
          accentColor="#198754"
        >
          <ExpenseRenameRuleList
            items={config.expenseRenameRules}
            onAdd={async (targetName, keywords) => {
              "use server";
              await addExpenseRenameRuleAction(targetName, keywords);
            }}
            onUpdate={async (oldTargetName, targetName, keywords) => {
              "use server";
              await updateExpenseRenameRuleAction(
                oldTargetName,
                targetName,
                keywords,
              );
            }}
            onRemove={async (targetName) => {
              "use server";
              await removeExpenseRenameRuleAction(targetName);
            }}
          />
        </CollapsibleSection>
      </div>

      {/* ── Stock Portfolio ── */}
      <div className="settings-group">
        <div className="settings-group-header">
          <span className="settings-group-icon" role="img" aria-label="השקעות">
            &#128200;
          </span>
          <span className="settings-group-title">השקעות</span>
        </div>

        <CollapsibleSection
          title="מניות"
          icon="&#128202;"
          description="הגדרת מניות וקרנות למעקב"
          accentColor="#0d6efd"
        >
          <StockDefinitionList
            items={stockConfig.stocks}
            onAdd={async (symbol, displayName, source, currency, label) => {
              "use server";
              await addStock(symbol, displayName, source, currency, label);
            }}
            onUpdate={async (
              oldSymbol,
              symbol,
              displayName,
              source,
              currency,
              label,
            ) => {
              "use server";
              await updateStock(
                oldSymbol,
                symbol,
                displayName,
                source,
                currency,
                label,
              );
            }}
            onRemove={async (symbol) => {
              "use server";
              await removeStock(symbol);
            }}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="בנקים ועמלות"
          icon="&#127974;"
          description="בנקים וברוקרים עם דמי ניהול ועמלות"
          accentColor="#198754"
        >
          <BrokerList
            items={stockConfig.brokers}
            onAdd={async (name, mgmtFee, purchaseFee) => {
              "use server";
              await addBroker(name, mgmtFee, purchaseFee);
            }}
            onUpdate={async (oldName, name, mgmtFee, purchaseFee) => {
              "use server";
              await updateBroker(oldName, name, mgmtFee, purchaseFee);
            }}
            onRemove={async (name) => {
              "use server";
              await removeBroker(name);
            }}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="יעדי השקעה"
          icon="&#127919;"
          description="יעדי חיסכון לפי טווח השקעה"
          accentColor="#6f42c1"
        >
          <StockGoalList
            items={stockConfig.goals}
            onAdd={async (term, label, targetAmount) => {
              "use server";
              await addGoal(term, label, targetAmount);
            }}
            onUpdate={async (oldLabel, term, label, targetAmount) => {
              "use server";
              await updateGoal(oldLabel, term, label, targetAmount);
            }}
            onRemove={async (label) => {
              "use server";
              await removeGoal(label);
            }}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
