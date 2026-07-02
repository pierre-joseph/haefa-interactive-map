import { Stethoscope, Activity, Hospital, Pill } from 'lucide-react';
import "./MapLegend.css";

const MapLegend = () => {
  const legendItems = [
    {
      type: 'Primary Health Center (PHC)',
      color: '#2563eb',
      Icon: Stethoscope,
      description: 'Standard medical care hub'
      },
    {
      type: 'Secondary Health Facilities',
      color: '#dc2626',
      Icon: Hospital,
      description: 'Inpatient beds, surgeries, tertiary labs'
    },
    {
      type: 'Health Post (HP)',
      color: '#16a34a',
      Icon: Activity,
      description: 'Community-level neighborhood post'
    },
    {
      type: 'Other Specialised Clinic',
      color: '#ea580c',
      Icon: Pill,
      description: 'Focused centers (NCD, mental health)'
    },
  ];

  return (
    <div className="legend-container">
    <h4 className="legend-title">Facility Types</h4>

    <div className="legend-list">
        {legendItems.map((item, index) => {
        const { Icon } = item;

        return (
            <div key={index} className="legend-item">
            <div
                className="icon-badge"
                style={{ backgroundColor: item.color }}
            >
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