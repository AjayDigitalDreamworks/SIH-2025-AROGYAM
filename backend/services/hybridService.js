// Determines which step the student should be in
function getStep(symptomLevel) {
  /**
   * symptomLevel: "mild", "moderate", "severe"
   * Returns step info
   */
  if (symptomLevel === "mild") {
    return { step: 1, assignedSupport: "Peer" };
  } else if (symptomLevel === "moderate") {
    return { step: 2, assignedSupport: "Trained Counselor" };
  } else {
    return { step: 3, assignedSupport: "Licensed Psychologist" };
  }
}

module.exports = { getStep };