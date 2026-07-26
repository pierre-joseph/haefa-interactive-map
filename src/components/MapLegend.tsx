import { BedDouble, Hospital, Cross, Syringe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import "./MapLegend.css";

const MapLegend = () => {
  const { t } = useTranslation();

  const legendItems = [
    {
      type: t('mapLegend.types.primaryHealthCenter.title'),
      color: '#2563eb',
      Icon: BedDouble,
      description: t('mapLegend.types.primaryHealthCenter.description')
      },
    {
      type: t('mapLegend.types.secondaryHealthFacility.title'),
      color: '#dc2626',
      Icon: Hospital,
      description: t('mapLegend.types.secondaryHealthFacility.description')
    },
    {
      type: t('mapLegend.types.healthPost.title'),
      color: '#16a34a',
      Icon: Cross,
      description: t('mapLegend.types.healthPost.description')
    },
    {
      type: t('mapLegend.types.specializedClinic.title'),
      color: '#ea580c',
      Icon: Syringe,
      description: t('mapLegend.types.specializedClinic.description')
    },
  ];

  return (
    <div className="legend-container">
      <div className="legend-header">
        <p className="legend-kicker">{t('mapLegend.title')}</p>
        <h4 className="legend-title">{t('mapLegend.subtitle')}</h4>
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