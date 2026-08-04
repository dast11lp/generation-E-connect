const CLOUDINARY_CLOUD_NAME = "dd9iztlrv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function uploadVideo(file) {
  if (!file || file.type.split("/")[0] !== "video") return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "alumni/cursos/");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("No fue posible subir el video.");

  const data = await response.json();
  return {
    link: data.secure_url,
    thumbnail: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${data.public_id}.jpg`,
  };
}

export async function uploadImage(file) {
  if (!file || file.type.split("/")[0] !== "image") return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "alumni/empleo/");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("No fue posible subir la imagen.");

  const data = await response.json();
  return { url: data.secure_url };
}