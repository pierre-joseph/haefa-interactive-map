import "./Checklist.css";

type ChecklistItem = {
  value: string;
  label: string;
};

type ChecklistSectionProps = {
  title: string;
  selectedCount: number;
  items: ChecklistItem[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

const ChecklistSection = ({ title, selectedCount, items, selectedValues, onToggle }: ChecklistSectionProps) => (
  <details className="checklist__dropdown">
    <summary className="checklist__options-summary">
      <span>{title}</span>
      <span className="checklist__options-summary__count">
        {selectedCount > 0 ? `${selectedCount} selected` : "Any"}
      </span>
    </summary>

    <div className="checklist__options">
      {items.map((item) => {
        const checked = selectedValues.includes(item.value);

        return (
          <label key={item.value} className={`checklist__option ${checked ? "is-active" : ""}`}>
            <span className="checklist__option-control">
              <input
                type="checkbox"
                className="checklist__option-input"
                checked={checked}
                onChange={() => onToggle(item.value)}
              />
              <span className="checklist__option-mark" aria-hidden="true" />
            </span>
            <span className="checklist__option-label">{item.label}</span>
          </label>
        );
      })}
    </div>
  </details>
);

export default ChecklistSection;