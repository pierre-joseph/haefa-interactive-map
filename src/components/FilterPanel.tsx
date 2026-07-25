import { useMemo, useState } from "react";
import type { FacilityRecord } from "./FacilityPopup";
import { SERVICE_CATEGORIES } from "./FacilityPopup";
import ChecklistSection from "./Checklist";
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
  const types = ["Primary Health Center", "Secondary Health Facility", "Health Post", "Other specialised"];
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

  return (
    <aside className="filter-panel" aria-label="Facility filters">
      <div className="filter-panel__header">
        <h3 className="filter-panel__title">Filter facilities</h3>
        <p className="filter-panel__subtitle">Refine by text, location, and services.</p>
      </div>

      <div className="filter-panel__search">
        <label>
          Search
          <input
            type="search"
            placeholder="Search for facilities..."
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
          />
        </label>
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title="Facility Name"
          selectedCount={filters.names.length}
          items={names.map((name) => ({ value: name, label: name }))}
          selectedValues={filters.names}
          onToggle={toggleName}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title="Implementing Agency"
          selectedCount={filters.agencies.length}
          items={agencies.map((agency) => ({ value: agency, label: agency }))}
          selectedValues={filters.agencies}
          onToggle={toggleAgency}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title="Facility Type"
          selectedCount={filters.types.length}
          items={types.map((type) => ({ value: type, label: type }))}
          selectedValues={filters.types}
          onToggle={toggleType}
        />
      </div>

      <div className="filter-panel__group">
        <ChecklistSection
          title="Facility Camps"
          selectedCount={filters.camps.length}
          items={camps.map((camp) => ({ value: camp, label: camp }))}
          selectedValues={filters.camps}
          onToggle={toggleCamp}
        />
      </div>
      
      <div className="filter-panel__group">
        <details className="filter-panel__services">
          <summary className="filter-panel__services-summary">
            <span>Facility Services</span>
            <span className="filter-panel__services-summary__count">
              {filters.services.length > 0 ? `${filters.services.length} selected` : "Any"}
            </span>
          </summary>

          <div className="filter-panel__services-body">
            {SERVICE_CATEGORIES.map((category) => (
              <ChecklistSection
                key={category.id}
                title={category.label}
                selectedCount={filters.services.filter((s) => category.fields.some((f) => f.key === s)).length}
                items={category.fields.map((field) => ({ value: field.key as string, label: field.label }))}
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
          Clear filters
        </button>
      </div>
    </aside>
  );
};

export default FilterPanel;