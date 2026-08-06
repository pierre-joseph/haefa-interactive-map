import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "./FormatNumber";
import "./FacilityPopup.css";

export type SpecialtyResponse = "Available" | "Not Normally Available" | "Partially Available" | "Unsure";
export type FacilityType = "Primary Health Center" | "Secondary Health Facility" | "Health Post" | "Specialized Clinic";
export type YesNo = "Yes" | "No";
export type BedCount = number | "Not normally provided";
export type Blank = "" | undefined;

export type FacilityServiceStatus = SpecialtyResponse | Blank;

export type FacilityRecord = {
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
  Tuberculosis?: FacilityServiceStatus;
  Basic_Lab?: FacilityServiceStatus;
  Basic_X_Ray?: FacilityServiceStatus;
  Hemodialysis_Unit?: FacilityServiceStatus;
  Lab_Secondary?: FacilityServiceStatus;
  Lab_Tertiary?: FacilityServiceStatus;
  Outpatient_Secondary?: FacilityServiceStatus;
  Outpatient_Primary?: FacilityServiceStatus;
  Radiology_Unit?: FacilityServiceStatus;
  Referral_Acceptance_and_Capacity?: FacilityServiceStatus;
  WHO_Basic_Emergency?: FacilityServiceStatus;
  Antenatal_Care?: FacilityServiceStatus;
  Asthma_COPD?: FacilityServiceStatus;
  CVD_Risk_Assessment?: FacilityServiceStatus;
  Diabetes?: FacilityServiceStatus;
  Hypertension?: FacilityServiceStatus;
  Inpatient_Acute_Rehab?: FacilityServiceStatus;
  Mental_Disorder_Management?: FacilityServiceStatus;
  NCD_Clinic?: FacilityServiceStatus;
  Outpatient_Rehab?: FacilityServiceStatus;
  Prosthetics_Orthotics?: FacilityServiceStatus;
  "Skilled care during childbirth"?: FacilityServiceStatus;
  "Growth Monitoring at Primary Care Level"?: FacilityServiceStatus;
  "Infant & Young Child Feeding (IEC on IYCF)"?: FacilityServiceStatus;
  "Integrated Management of Childhood Illness (IMCI under 5)"?: FacilityServiceStatus;
  "Pyschological First Aid"?: FacilityServiceStatus;
  EPI?: FacilityServiceStatus;
  IMCI_under_5?: FacilityServiceStatus;
  Management_of_Children_Diseases?: FacilityServiceStatus;
  BEmOC?: FacilityServiceStatus;
  Hours?: string | Blank;
};

type FacilityPopupProps = {
  facility: FacilityRecord;
};

export type FacilityServiceKey =
  | "Tuberculosis"
  | "Basic_Lab"
  | "Basic_X_Ray"
  | "Hemodialysis_Unit"
  | "Lab_Secondary"
  | "Lab_Tertiary"
  | "Outpatient_Secondary"
  | "Outpatient_Primary"
  | "Radiology_Unit"
  | "Referral_Acceptance_and_Capacity"
  | "WHO_Basic_Emergency"
  | "Antenatal_Care"
  | "Asthma_COPD"
  | "CVD_Risk_Assessment"
  | "Diabetes"
  | "Hypertension"
  | "Inpatient_Acute_Rehab"
  | "Mental_Disorder_Management"
  | "NCD_Clinic"
  | "Outpatient_Rehab"
  | "Prosthetics_Orthotics"
  | "Skilled care during childbirth"
  | "Growth Monitoring at Primary Care Level"
  | "Infant & Young Child Feeding (IEC on IYCF)"
  | "Integrated Management of Childhood Illness (IMCI under 5)"
  | "Pyschological First Aid"
  | "EPI"
  | "IMCI_under_5"
  | "Management_of_Children_Diseases"
  | "BEmOC";

type ServiceField = { key: FacilityServiceKey; label: string };
type ServiceCategory = { id: string; label: string; fields: ServiceField[] };

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "diagnostics",
    label: "Diagnostics & Labs",
    fields: [
      { key: "Basic_Lab", label: "Basic Lab" },
      { key: "Basic_X_Ray", label: "X-Ray" },
      { key: "Lab_Secondary", label: "Secondary Lab" },
      { key: "Lab_Tertiary", label: "Tertiary Lab" },
      { key: "Hemodialysis_Unit", label: "Hemodialysis" },
    ],
  },
  {
    id: "outpatient-emergency",
    label: "Outpatient & Emergency",
    fields: [
      { key: "Outpatient_Primary", label: "Outpatient Primary Care" },
      { key: "Outpatient_Secondary", label: "Outpatient Secondary Care" },
      { key: "WHO_Basic_Emergency", label: "Emergency Care" },
      { key: "Referral_Acceptance_and_Capacity", label: "Referrals" },
    ],
  },
  {
    id: "ncd",
    label: "Chronic Diseases",
    fields: [
      { key: "Asthma_COPD", label: "Asthma and COPD" },
      { key: "CVD_Risk_Assessment", label: "Cardiovascular Disease Risk" },
      { key: "Diabetes", label: "Diabetes" },
      { key: "Hypertension", label: "Hypertension" },
      { key: "NCD_Clinic", label: "NCD Clinic" },
    ],
  },
  {
    id: "infectious",
    label: "Infectious Disease",
    fields: [
      { key: "Tuberculosis", label: "Tuberculosis" },
    ],
  },
  {
    id: "maternal-child",
    label: "Maternal & Child",
    fields: [
      { key: "Antenatal_Care", label: "Prenatal Care" },
      { key: "Skilled care during childbirth", label: "Skilled care during childbirth" },
      { key: "BEmOC", label: "Emergency Birth Care" },
      { key: "EPI", label: "Immunization (EPI)" },
      { key: "Growth Monitoring at Primary Care Level", label: "Growth Monitoring at Primary Care Level" }, 
      { key: "Infant & Young Child Feeding (IEC on IYCF)", label: "Infant & Young Child Feeding (IEC on IYCF)" },
      { key: "Integrated Management of Childhood Illness (IMCI under 5)", label: "Under-5 Illness Protocol (IMCI)" },
      { key: "Management_of_Children_Diseases", label: "Child Disease Management" },
    ],
  },
  {
    id: "mental-health",
    label: "Mental Health",
    fields: [
      { key: "Mental_Disorder_Management", label: "Mental Disorder Management" },
      { key: "Pyschological First Aid", label: "Psychological First Aid" },
    ],
  },
  {
    id: "rehab",
    label: "Rehabilitation",
    fields: [
      { key: "Inpatient_Acute_Rehab", label: "Acute Rehab" },
      { key: "Outpatient_Rehab", label: "Outpatient Rehab" },
      { key: "Prosthetics_Orthotics", label: "Prosthetics" },
    ],
  },
];

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

const getRiskClass = (value: YesNo | "( )" | Blank) => {
  if (value === "Yes") return "is-unavailable";
  if (value === "No") return "is-available";
  return "is-unsure";
};

const FacilityPopup = ({ facility }: FacilityPopupProps) => {
  const { t, i18n } = useTranslation(); 

  const formatValue = (value: string | number | undefined) => {
  if (isBlank(value)) return t('yesNo.unknown');
    return String(value);
  };

  const formatBeds = (value: string | number | undefined) => {
    if (isBlank(value)) return t('yesNo.unknown');
    if (value === "Not normally provided") return t('yesNo.notProvided');
    if (typeof value === "number") return formatNumber(value, i18n.language);
    return String(value);
  };
  
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "capacity">("overview");
  const groupedServices = useMemo(() => {
    return SERVICE_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      items: cat.fields
        .map(({ key, label }) => ({ key, label, value: facility[key] as FacilityServiceStatus }))
        .filter((s) => !isBlank(s.value))
        .sort((a, b) => RESPONSE_RANK[a.value as SpecialtyResponse] - RESPONSE_RANK[b.value as SpecialtyResponse]),
    })).filter((cat) => cat.items.length > 0);
  }, [facility]);

  const services = useMemo(() => groupedServices.flatMap((cat) => cat.items), [groupedServices]);

  const availableCount = services.filter((s) => s.value === "Available").length;
  const status = String(facility.Status ?? "");
  const statusMeta = STATUS_META[status] ?? { className: "is-unsure" };

  return (
    <div className="fpop">
      <div className="fpop__header">
        <div className="fpop__eyebrow">
          <span className="fpop__code">{formatValue(facility["Block Name"])}</span>
          <span className={`fpop__pill ${statusMeta.className}`}>{t(`status.${status}`)}</span>
        </div>
        <h3 className="fpop__title">{formatValue(facility["Facility Name"])}</h3>
        <p className="fpop__subtitle">
          {t(`facilityTypes.${facility["Facility Type"]}`)} · {formatValue(facility["Implementing Agency"])}
        </p>
      </div>

      <div className="fpop__tabs" role="tablist" aria-label={t('facilityPopup.ariaLabel')}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          className={activeTab === "overview" ? "is-active" : ""} 
          onClick={() => setActiveTab("overview")}
        >
          {t('facilityPopup.tabs.overview')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "capacity"}
          className={activeTab === "capacity" ? "is-active" : ""}
          onClick={() => setActiveTab("capacity")}
        >
          {t('facilityPopup.tabs.capacity')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "services"}
          className={activeTab === "services" ? "is-active" : ""}
          onClick={() => setActiveTab("services")}
        >
          {t('facilityPopup.tabs.services')}
          {services.length > 0 ? ` (${formatNumber(availableCount, i18n.language)}/${formatNumber(services.length, i18n.language)})` : ""}
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="fpop__content">
          <dl className="fpop__grid">
            <div>
              <dt>{t('facilityPopup.overview.agency')}</dt>
              <dd>{formatValue(facility["Implementing Agency"])}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.hours')}</dt>
              <dd>{formatValue(facility.Hours)}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.camp')}</dt>
              <dd>{formatValue(facility["Camp Name"])}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.block')}</dt>
              <dd>{formatValue(facility["Block Name"])}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.coordinates')}</dt>
              <dd>
                {formatValue(facility.Latitude)}, {formatValue(facility.Longitude)}
              </dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.structure')}</dt>
              <dd>{t(`structureType.${facility["Structure Type"]}`)}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.targetPopulation')}</dt>
              <dd>{t(`targetPopulation.${facility["Target Population"]}`)}</dd>
            </div>
            <div>
              <dt>{t('facilityPopup.overview.disabilityAccess')}</dt>
              <dd>{t(`yesNo.${formatValue(facility["Disability Access"])}`)}</dd>
            </div>
          </dl>
        </div>
      )}

      {activeTab === "capacity" && (
        <div className="fpop__content">
          <div className="fpop__stats">
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Number of Inpatient Beds"])}</span>
              <span className="fpop__stat-label">{t('facilityPopup.capacity.inpatientBeds')}</span>
            </div>
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Intensive Care Unit (ICU) beds"])}</span>
              <span className="fpop__stat-label">{t('facilityPopup.capacity.icuBeds')}</span>
            </div>
            <div className="fpop__stat">
              <span className="fpop__stat-value">{formatBeds(facility["Number of Maternity Beds"])}</span>
              <span className="fpop__stat-label">{t('facilityPopup.capacity.maternityBeds')}</span>
            </div>
          </div>

          <dl className="fpop__grid">
            <div>
              <dt>{t('facilityPopup.capacity.floodRisk')}</dt>
              <dd>
                <span className={`fpop__tag ${getRiskClass(facility.RiskFlood)}`}>
                  {t(`yesNo.${formatValue(facility.RiskFlood)}`)}
                </span>
              </dd>
            </div>
            <div>
              <dt>{t('facilityPopup.capacity.landRisk')}</dt>
              <dd>
                <span className={`fpop__tag ${getRiskClass(facility.RiskLand)}`}>
                  {t(`yesNo.${formatValue(facility.RiskLand)}`)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      )}

      {activeTab === "services" && (
        <div className="fpop__content">
          {groupedServices.length === 0 ? (
            <p className="fpop__empty">{t('facilityPopup.emptyServices')}</p>
          ) : (
            groupedServices.map((cat) => (
              <details className="fpop__category" key={cat.id}>
                <summary>
                  <span className="fpop__category-title">
                    <svg className="fpop__category-chevron" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                      <path d="M1 0.5 L6 4 L1 7.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                     {t(`serviceCategories.${cat.id}.label`, { defaultValue: cat.label })}
                  </span>
                  <span className="fpop__category-count">{formatNumber(cat.items.length, i18n.language)}</span>
                </summary>
                <ul className="fpop__services">
                  {cat.items.map(({ key, label, value }) => (
                    <li key={key}>
                      <span
                        className={`fpop__dot ${RESPONSE_META[value as SpecialtyResponse].className}`}
                        aria-hidden="true"
                      />
                      <span className="fpop__service-label">
                        {t(`serviceCategories.${cat.id}.fields.${key as string}`, { defaultValue: label })}
                      </span>
                      <span className={`fpop__tag ${RESPONSE_META[value as SpecialtyResponse].className}`}>
                        {t(`specialtyResponseShort.${value as SpecialtyResponse}`, { defaultValue: RESPONSE_META[value as SpecialtyResponse].short })}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacilityPopup;