export function normalizeTopic(topic) {
  if (typeof topic === "string") {
    return { title: topic, links: [] };
  }
  return topic;
}