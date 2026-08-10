import { seedMentorsIfEmpty } from "../../services/mentor-storage.service.js";

document.addEventListener("DOMContentLoaded", function () {

  const els = document.querySelectorAll('.reveal');
  if (els.length === 0) return;

  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { 
    obs.observe(el); 
  });
});

seedMentorsIfEmpty();