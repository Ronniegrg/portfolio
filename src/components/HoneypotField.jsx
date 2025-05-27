import { useState } from "react";
import styles from "./HoneypotField.module.css";

/**
 * Honeypot field component for spam protection
 * This field should remain empty - if filled, it indicates a bot
 */
const HoneypotField = ({ onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Notify parent component of the honeypot field value
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.honeypot}>
      <label htmlFor="website">Website (leave blank):</label>
      <input
        type="text"
        id="website"
        name="website"
        value={value}
        onChange={handleChange}
        tabIndex="-1"
        autoComplete="off"
        placeholder=""
        aria-hidden="true"
      />
    </div>
  );
};

export default HoneypotField;
