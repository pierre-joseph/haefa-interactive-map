import { useMemo, useState } from "react";

type FacilityRecord = {
  [key: string]: string | number | undefined;
  "Facility Name"?: string | number;
  "Implementing Agency"?: string | number;
  "Camp Name"?: string | number;
  "Block Name"?: string | number;
  "Facility Type"?: string | number;
  Status?: string | number;
  "Disability Access"?: string | number;
  "Target Population"?: string | number;
  RiskLand?: string | number;
  RiskFlood?: string | number;
  "Number of Inpatient Beds"?: string | number;
  "Number of Maternity Beds"?: string | number;
  Tuberculosis?: string | number;
  Basic_Lab?: string | number;
  Basic_X_Ray?: string | number;
  Hemodialysis_Unit?: string | number;
  Lab_Secondary?: string | number;
  Lab_Tertiary?: string | number;
  Outpatient_Secondary?: string | number;
  Outpatient_Primary?: string | number;
  Radiology_Unit?: string | number;
  Referral_Acceptance_and_Capacity?: string | number;
  WHO_Basic_Emergency?: string | number;
  Antenatal_Care?: string | number;
  Asthma_COPD?: string | number;
  CVD_Risk_Assessment?: string | number;
  Diabetes?: string | number;
  Hypertension?: string | number;
  Inpatient_Acute_Rehab?: string | number;
  NCD_Clinic?: string | number;
  Outpatient_Rehab?: string | number;
  Prosthetics_Orthotics?: string | number;
  BEmOC?: string | number;
};

type FacilityPopupProps = {
  facility: FacilityRecord;
};

const serviceFields = [
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
] as const;

const formatValue = (value: string | number | undefined) => {
  if (value === undefined || value === null || value === "") {
    return "Not listed";
  }
  return String(value);
};

const FacilityPopup = ({ facility }: FacilityPopupProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "capacity">("overview");

  const serviceHighlights = useMemo(() => {
    return serviceFields.filter(({ key }) => {
      const value = facility[key];
      return value && String(value).trim() !== "";
    });
  }, [facility]);

  return (
    <div className="facility-popup">
      <div className="facility-popup__header">
        <h3>{formatValue(facility["Facility Name"])}</h3>
        <p>{formatValue(facility["Facility Type"])}</p>
      </div>

      <div className="facility-popup__tabs" role="tablist" aria-label="Facility details">
        <button
          type="button"
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={activeTab === "services" ? "active" : ""}
          onClick={() => setActiveTab("services")}
        >
          Specialties
        </button>
        <button
          type="button"
          className={activeTab === "capacity" ? "active" : ""}
          onClick={() => setActiveTab("capacity")}
        >
          Capacity
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="facility-popup__content">
          <p>
            <strong>Agency:</strong> {formatValue(facility["Implementing Agency"])}
          </p>
          <p>
            <strong>Camp:</strong> {formatValue(facility["Camp Name"])}
          </p>
          <p>
            <strong>Block:</strong> {formatValue(facility["Block Name"])}
          </p>
          <p>
            <strong>Status:</strong> {formatValue(facility.Status)}
          </p>
          <p>
            <strong>Disability access:</strong> {formatValue(facility["Disability Access"])}
          </p>
          <p>
            <strong>Target population:</strong> {formatValue(facility["Target Population"])}
          </p>
        </div>
      )}

      {activeTab === "services" && (
        <div className="facility-popup__content">
          <p className="facility-popup__hint">Swipe through the services this centre offers or supports.</p>
          <ul className="facility-popup__list">
            {serviceHighlights.map(({ key, label }) => (
              <li key={key}>
                <span>{label}</span>
                <strong>{formatValue(facility[key])}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "capacity" && (
        <div className="facility-popup__content">
          <p>
            <strong>Inpatient beds:</strong> {formatValue(facility["Number of Inpatient Beds"])}
          </p>
          <p>
            <strong>Maternity beds:</strong> {formatValue(facility["Number of Maternity Beds"])}
          </p>
          <p>
            <strong>Flood risk:</strong> {formatValue(facility.RiskFlood)}
          </p>
          <p>
            <strong>Land risk:</strong> {formatValue(facility.RiskLand)}
          </p>
        </div>
      )}
    </div>
  );
};

export default FacilityPopup;
