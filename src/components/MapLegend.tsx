import { Stethoscope, Activity, Hospital, Pill } from 'lucide-react';
import "./MapLegend.css";

const MapLegend = () => {
  const legendItems = [
    {
      type: 'Primary Health Center',
      color: '#2563eb',
      Icon: Stethoscope,
      description: 'Frontline outpatient and routine care'
      },
    {
      type: 'Secondary Health Facility',
      color: '#dc2626',
      Icon: Hospital,
      description: 'Higher-acuity care and inpatient services'
    },
    {
      type: 'Health Post',
      color: '#16a34a',
      Icon: Activity,
      description: 'Community-level access point'
    },
    {
      type: 'Specialized Clinic',
      color: '#ea580c',
      Icon: Pill,
      description: 'Targeted services such as NCD or specialty care'
    },
  ];

  return (
    <div className="legend-container">
      <div className="legend-header">
        <p className="legend-kicker">Map key</p>
        <h4 className="legend-title">Facility types</h4>
      </div>

      <div className="legend-list">
        {legendItems.map((item, index) => {
          const { Icon } = item;

          return (
            <div key={index} className="legend-item">
              <div className="icon-badge" style={{ backgroundColor: item.color }}>
                <Icon size={14} color="white" />
              </div>

              <div>
                <span className="label-text">{item.type}</span>
                <p className="label-subtext">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapLegend;