import { useMemo, useState } from "react";
import "./FacilityPopup.css";

export type SpecialtyResponse = "Available" | "Not Normally Available" | "Partially Available" | "Unsure";
export type FacilityType = "Primary Health Center" | "Secondary Health Facility" | "Health Post" | "Other specialised";
export type YesNo = "Yes" | "No";
export type BedCount = number | "Not normally provided";
export type Blank = "" | undefined;

export type FacilityRecord = {
  [key: string]: string | number | undefined;
  "Facility ID"?: number | string;
  "Facility Name"?: string;
  "Implementing Agency"?: string;
  "Camp Name"?: string;
  "Block Name"?: string;
  "Facility Type"?: FacilityType | Blank;
  Longitude?: number;
  Latitude?: number;
  "Structure Type"?: "Transitional" | "Durable" | "Temporary" | Blank;
  Status?: "Functional" | "Non Functional" | "Under Construction" | Blank;
  "Disability Access"?: YesNo | "( )" | Blank;
  "Target Population"?: "Refugee" | "Both" | "Host Community" | Blank;
  RiskLand?: YesNo | "( )" | Blank;
  RiskFlood?: YesNo | "( )" | Blank;
  "Number of Inpatient Beds"?: BedCount | Blank;
  "Intensive Care Unit (ICU) beds"?: BedCount | Blank;
  "Number of Maternity Beds"?: BedCount | Blank;
  Tuberculosis?: SpecialtyResponse | Blank;
  Basic_Lab?: SpecialtyResponse | Blank;
  Basic_X_Ray?: SpecialtyResponse | Blank;
  Hemodialysis_Unit?: SpecialtyResponse | Blank;
  Lab_Secondary?: SpecialtyResponse | Blank;
  Lab_Tertiary?: SpecialtyResponse | Blank;
  Outpatient_Secondary?: SpecialtyResponse | Blank;
  Outpatient_Primary?: SpecialtyResponse | Blank;
  Radiology_Unit?: SpecialtyResponse | Blank;
  Referral_Acceptance_and_Capacity?: SpecialtyResponse | Blank;
  WHO_Basic_Emergency?: SpecialtyResponse | Blank;
  Antenatal_Care?: SpecialtyResponse | Blank;
  Asthma_COPD?: SpecialtyResponse | Blank;
  CVD_Risk_Assessment?: SpecialtyResponse | Blank;
  Diabetes?: SpecialtyResponse | Blank;
  Hypertension?: SpecialtyResponse | Blank;
  Inpatient_Acute_Rehab?: SpecialtyResponse | Blank;
  NCD_Clinic?: SpecialtyResponse | Blank;
  Outpatient_Rehab?: SpecialtyResponse | Blank;
  Prosthetics_Orthotics?: SpecialtyResponse | Blank;
  BEmOC?: SpecialtyResponse | Blank;
};

type FacilityPopupProps = {
  facility: FacilityRecord;
};

export const serviceFields = [
  { key: "Tuberculosis", label: "TB services" },
  { key: "Basic_Lab", label: "Basic lab" },
  { key: "Basic_X_Ray", label: "X-ray" },
  { key: "Hemodialysis_Unit", label: "Hemodialysis" },
  { key: "Lab_Secondary", label: "Secondary lab" },
  { key: "Lab_Tertiary", label: "Tertiary lab" },
  { key: "Outpatient_Secondary", label: "Secondary outpatient" },
  { key: "Outpatient_Primary", label: "Primary outpatient" },
  { key: "Radiology_Unit", label: "Radiology" },
  { key: "Referral_Acceptance_and_Capacity", label: "Referral capacity" },
  { key: "WHO_Basic_Emergency", label: "Emergency care" },
  { key: "Antenatal_Care", label: "Antenatal care" },
  { key: "Asthma_COPD", label: "Asthma/COPD" },
  { key: "CVD_Risk_Assessment", label: "CVD risk assessment" },
  { key: "Diabetes", label: "Diabetes care" },
  { key: "Hypertension", label: "Hypertension care" },
  { key: "Inpatient_Acute_Rehab", label: "Acute rehab" },
  { key: "NCD_Clinic", label: "NCD clinic" },
  { key: "Outpatient_Rehab", label: "Rehabilitation" },
  { key: "Prosthetics_Orthotics", label: "Prosthetics/orthotics" },
  { key: "BEmOC", label: "BEmOC" },
];

serviceFields.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

// Sort order + visual treatment for each specialty response.
const RESPONSE_RANK: Record<SpecialtyResponse, number> = {
  Available: 0,
  "Partially Available": 1,
  Unsure: 2,
  "Not Normally Available": 3,
};

const RESPONSE_META: Record<SpecialtyResponse, { short: string; className: string }> = {
  Available: { short: "Available", className: "is-available" },
  "Partially Available": { short: "Partial", className: "is-partial" },
  Unsure: { short: "Unsure", className: "is-unsure" },
  "Not Normally Available": { short: "Unavailable", className: "is-unavailable" },
};

const STATUS_META: Record<string, { className: string }> = {
  Functional: { className: "is-available" },
  "Non Functional": { className: "is-unavailable" },
  "Under Construction": { className: "is-partial" },
};

const isBlank = (value: unknown) => value === undefined || value === null || value === "" || value === "( )";

const formatValue = (value: string | number | undefined) => {
  if (isBlank(value)) return "Unknown";
  return String(value);
};

const formatBeds = (value: string | number | undefined) => {
  if (isBlank(value)) return "Unknown";
  if (value === "Not normally provided") return "Not provided";
  return String(value);
};

const getRiskClass = (value: YesNo | "( )" | Blank) => {
  if (value === "Yes") return "is-unavailable";
  if (value === "No") return "is-available";
  return "is-unsure";
};

const FacilityPopup = ({ facility }: FacilityPopupProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "capacity">("overview");

  const services = useMemo(() => {
    return serviceFields
      .map(({ key, label }) => ({ key, label, value: facility[key] as SpecialtyResponse | Blank }))
      .filter((s) => !isBlank(s.value))
      .sort((a, b) => RESPONSE_RANK[a.value as SpecialtyResponse] - RESPONSE_RANK[b.value as SpecialtyResponse]);
  }, [facility]);

  const availableCount = services.filter((s) => s.value === "Available").length;
  const status = String(facility.Status ?? "");
  const statusMeta = STATUS_META[status] ?? { className: "is-unsure" };

  return (
    <div className="fpop">
      <div className="fpop__header">
        <div className="fpop__eyebrow">
          <span className="fpop__code">{formatValue(facility["Block Name"])}</span>
          <span className={`fpop__pill ${statusMeta.className}`}>{formatValue(facility.Status)}</span>
        </div>
        <h3 className="fpop__title">{formatValue(facility["Facility Name"])}</h3>
        <p className="fpop__subtitle">
          {formatValue(facility["Facility Type"])} · {formatValue(facility["Implementing Agency"])}
        </p>
      </div>

      {services.length > 0 && (
        <div className="fpop__strip" aria-hidden="true">
          {services.map((s) => (
            <span
              key={s.key}
              className={`fpop__strip-seg ${RESPONSE_META[s.value as SpecialtyResponse].className}`}
              title={`${s.label}: ${s.value}`}
            />
          ))}
        </div>
      )}

      <div className="fpop__tabs" role="tablist" aria-label="Facility details">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          className={activeTab === "overview" ? "is-active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "capacity"}
          className={activeTab === "capacity" ? "is-active" : ""}
          onClick={() => setActiveTab("capacity")}
        >
          Capacity
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "services"}
          className={activeTab === "services" ? "is-active" : ""}
          onClick={() => setActiveTab("services")}
        >
          Specialties{services.length > 0 ? ` (${availableCount}/${services.length})` : ""}
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="fpop__content">
          <dl className="fpop__grid">
            <div>
              <dt>Agency</dt>
              <dd>{formatValue(facility["Implementing Agency"])}</dd>
            </div>
            <div>
              <dt>Camp</dt>
              <dd>{formatValue(facility["Camp Name"])}</dd>
            </div>
            <div>
              <dt>Block</dt>
              <dd>{formatValue(facility["Block Name"])}</dd>
            </div>
            <div>
              <dt>Coordinates</dt>
              <dd>
                {formatValue(facility.Latitude)}, {formatValue(facility.Longitude)}
              </dd>
            </div>
            <div>
              <dt>Structure</dt>
              <dd>{formatValue(facility["Structure Type"])}</dd>
            </div>
            <div>
              <dt>Target population</dt>
              <dd>{formatValue(facility["Target Population"])}</dd>
            </div>
            <div>
              <dt>Disability access</dt>
              <dd>{formatValue(facility["Disability Access"])}</dd>
            </div>
          </dl>
        </div>
      )}

      {activeTab === "services" && (
        <div className="fpop__content">
          {services.length === 0 ? (
            <p className="fpop__empty">No specialty data recorded for this facility.</p>
          ) : (
            <ul className="fpop__services">
              {services.map(({ key, label, value }) => (
                <li key={key}>
                  <span
                    className={`fpop__dot ${RESPONSE_META[value as SpecialtyResponse].className}`}
                    aria-hidden="true"
                  />
                  <span className="fpop__service-label">{label}</span>
                  <span className={`fpop__tag ${RESPONSE_META[value as SpecialtyResponse].className}`}>
                    {RESPONSE_META[value as SpecialtyResponse].short}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "capacity" && (
        <div className="fpop__content">
          <div className="fpop__stats">
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Number of Inpatient Beds"])}</span>
              <span className="fpop__stat-label">Inpatient beds</span>
            </div>
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Intensive Care Unit (ICU) beds"])}</span>
              <span className="fpop__stat-label">ICU beds</span>
            </div>
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Number of Maternity Beds"])}</span>
              <span className="fpop__stat-label">Maternity beds</span>
            </div>
          </div>

          <dl className="fpop__grid">
            <div>
              <dt>Flood risk</dt>
              <dd>
                <span className={`fpop__tag ${getRiskClass(facility.RiskFlood)}`}>
                  {formatValue(facility.RiskFlood)}
                </span>
              </dd>
            </div>
            <div>
              <dt>Land risk</dt>
              <dd>
                <span className={`fpop__tag ${getRiskClass(facility.RiskLand)}`}>
                  {formatValue(facility.RiskLand)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default FacilityPopup;