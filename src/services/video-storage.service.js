const STORAGE_KEY = "grabaciones";

export function initializeVideos(seedVideos) {
  const savedVideos = readVideos();
  if (!savedVideos.length) writeVideos(seedVideos);
}

export function readVideos() {
  try {
    const savedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return savedVideos.map(normalizeVideo);
  } catch {
    return [];
  }
}

export function saveVideo(video) {
  const videos = readVideos();
  const nextId = videos.length ? Math.max(...videos.map((item) => item.id)) + 1 : 1;
  const newVideo = { ...video, id: nextId };
  videos.push(newVideo);
  writeVideos(videos);
  return newVideo;
}

function writeVideos(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

// Compatibilidad con los datos que la primera versión guardaba en español.
function normalizeVideo(video) {
  return {
    id: video.id,
    category: video.category ?? video.categoria ?? "",
    title: video.title ?? video.titulo ?? "",
    author: video.author ?? video.autor ?? "",
    date: video.date ?? video.fecha ?? "",
    duration: video.duration ?? video.duracion ?? "",
    thumbnail: video.thumbnail ?? "",
    link: video.link ?? "",
  };
}
