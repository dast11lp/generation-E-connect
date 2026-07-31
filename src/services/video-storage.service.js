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

export function updateVideo(id, updates) {
  const videos = readVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;

  videos[index] = { ...videos[index], ...updates };
  writeVideos(videos);
  return videos[index];
}

export function deleteVideo(id) {
  const videos = readVideos();
  const filtered = videos.filter((v) => v.id !== id);
  writeVideos(filtered);
  return filtered.length !== videos.length;
}

function writeVideos(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

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
    sourceType: video.sourceType ?? inferSourceType(video), // <-- nuevo
  };
}

// Compatibilidad: videos guardados antes de que existiera sourceType.
// Los archivos subidos siempre generan URL de Cloudinary; si el link
// no pertenece a ese dominio, asumimos que fue registrado por URL externa.
function inferSourceType(video) {
  const link = video.link ?? video.link;
  return link.includes("res.cloudinary.com") ? "file" : "url";
}