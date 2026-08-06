import { useMemo, useState } from "react";
import type { FacilityRecord } from "./FacilityPopup";
import { SERVICE_CATEGORIES } from "./FacilityPopup";
import ChecklistSection from "./Checklist";
import { useTranslation } from 'react-i18next';
import "./FilterPanel.css";

type Filters = {
  query: string;
  names: string[];
  agencies: string[];
  types: string[];
  services: string[]; 
  camps: string[];
};

type Props = {
  facilities: FacilityRecord[];
  filters: Filters;
  onChange: (next: Filters) => void;
};

const uniqueValues = (items: FacilityRecord[], key: string) => {
  const set = new Set<string>();
  items.forEach((f) => {
    const v = f[key as keyof FacilityRecord];
    if (v !== undefined && v !== null && String(v).trim() !== "") set.add(String(v));
  });
  return Array.from(set).sort();
};

const FilterPanel = ({ facilities, filters, onChange }: Props) => {
  const names = useMemo(() => uniqueValues(facilities, "Facility Name"), [facilities]).sort((a, b) => a.localeCompare(b));
  const agencies = useMemo(() => uniqueValues(facilities, "Implementing Agency"), [facilities]).sort((a, b) => a.localeCompare(b));
  const camps = useMemo(() => uniqueValues(facilities, "Camp Name"), [facilities]);
  const types = ["Primary Health Center", "Secondary Health Facility", "Health Post", "Specialized Clinic"];
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const toggleCamp = (key: string) => {
    const present = new Set(filters.camps);
    if (present.has(key)) present.delete(key);
    else present.add(key);
    onChange({ ...filters, camps: Array.from(present) });
  };

  const toggleName = (key: string) => {
    const present = new Set(filters.names);
    if (present.has(key)) present.delete(key);
    else present.add(key);
    onChange({ ...filters, names: Array.from(present) });
  };

  const toggleAgency = (key: string) => {
    const present = new Set(filters.agencies);
    if (present.has(key)) present.delete(key);
    else present.add(key);
    onChange({ ...filters, agencies: Array.from(present) });
  };

  const toggleType = (key: string) => {
    const present = new Set(filters.types);
    if (present.has(key)) present.delete(key);
    else present.add(key);
    onChange({ ...filters, types: Array.from(present) });
  };

  const toggleService = (key: string) => {
    const present = new Set(filters.services);
    if (present.has(key)) present.delete(key);
    else present.add(key);
    onChange({ ...filters, services: Array.from(present) });
  };

  const { t } = useTranslation();

  return (
    <aside className="filter-panel" aria-label="Facility filters">
      <div className="filter-panel__header">
        <h3 className="filter-panel__title">{t('filterPanel.title')}</h3>
        <p className="filter-panel__subtitle">{t('filterPanel.subtitle')}</p>
      </div>

      <div className="filter-panel__search">
        <label>
          {t('filterPanel.search')}
          <input
            type="search"
            placeholder={t('filterPanel.searchPlaceholder')}
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
          />
        </label>
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title={t('filterPanel.name')}
          selectedCount={filters.names.length}
          items={names.map((name) => ({ value: name, label: name }))}
          selectedValues={filters.names}
          onToggle={toggleName}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title={t('filterPanel.agency')}
          selectedCount={filters.agencies.length}
          items={agencies.map((agency) => ({ value: agency, label: agency }))}
          selectedValues={filters.agencies}
          onToggle={toggleAgency}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title={t('filterPanel.type')}
          selectedCount={filters.types.length}
          items={types.map((type) => ({ value: type, label: t(`facilityTypes.${type}`, { defaultValue: type }) }))}
          selectedValues={filters.types}
          onToggle={toggleType}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title={t('filterPanel.camp')}
          selectedCount={filters.camps.length}
          items={camps.map((camp) => ({ value: camp, label: camp }))}
          selectedValues={filters.camps}
          onToggle={toggleCamp}
        />
      </div>
      
      <div className="filter-panel__group">
        <details className="filter-panel__services">
          <summary className="filter-panel__services-summary">
            <span>{t('filterPanel.services')}</span>
            <span className="filter-panel__services-summary__count">
              {filters.services.length > 0 ? t("filterPanel.selectedCount", { count: filters.services.length }) : t("filterPanel.any")}
            </span>
          </summary>

          <div className="filter-panel__services-body">
            {SERVICE_CATEGORIES.map((category) => (
              <ChecklistSection
                key={category.id}
                title={t(`serviceCategories.${category.id}.label`, { defaultValue: category.label })}
                selectedCount={filters.services.filter((s) => category.fields.some((f) => f.key === s)).length}
                items={category.fields.map((field) => ({ value: field.key as string, label: t(`serviceCategories.${category.id}.fields.${field.key}`, { defaultValue: field.label }) }))}
                selectedValues={filters.services}
                onToggle={toggleService}
                isOpen={openCategory === category.id}
                onOpenChange={(open) => setOpenCategory(open ? category.id : null)}
              />
            ))}
          </div>
        </details>
      </div>

      <div className="filter-panel__actions">
        <button type="button" onClick={() => onChange({ query: "", types: [], names: [], agencies: [], services: [], camps: [] })}>
          {t('filterPanel.clearFilters')}
        </button>
      </div>
    </aside>
  );
};

export default FilterPanel;