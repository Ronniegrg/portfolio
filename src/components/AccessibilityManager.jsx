import { useEffect } from "react";

/**
 * Component to manage focus outline for keyboard users only
 * Adds a class to the body when keyboard navigation is detected
 * and removes it on mouse click
 */
const AccessibilityManager = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Add class when Tab key is pressed
      if (event.key === "Tab") {
        document.body.classList.add("keyboard-user");
      }
    };

    const handleMouseDown = () => {
      // Remove class on mouse use
      document.body.classList.remove("keyboard-user");
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AccessibilityManager;
