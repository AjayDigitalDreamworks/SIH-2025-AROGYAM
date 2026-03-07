function selectAdaptiveModule(symptom, CBTModules, moduleScores) {
  const candidates = CBTModules.filter(mod => mod.symptom === symptom.toLowerCase());
  if (candidates.length === 0) return { name: "General CBT Guidance" };

  const totalScore = candidates.reduce((sum, m) => sum + moduleScores[m.name], 0);
  const rand = Math.random() * totalScore;
  let cumulative = 0;
  for (let mod of candidates) {
    cumulative += moduleScores[mod.name];
    if (rand <= cumulative) return mod;
  }
  return candidates[0];
}


function updateModuleScores(moduleScores, feedback) {
  moduleScores[feedback.module] += feedback.rating;
  if (moduleScores[feedback.module] < 0) moduleScores[feedback.module] = 0.1;
}

module.exports = { selectAdaptiveModule, updateModuleScores };