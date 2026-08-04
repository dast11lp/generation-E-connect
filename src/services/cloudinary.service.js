const CLOUDINARY_CLOUD_NAME = "dkfb1wppj";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function uploadVideo(file, folder = "assets/recording") {
  if (!file || file.type.split("/")[0] !== "video") return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("No fue posible subir el video.");

  const data = await response.json();
  return {
    link: data.secure_url,
    thumbnail: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${data.public_id}.jpg`,
    publicId: data.public_id,
    folder: data.asset_folder ?? data.folder,
  };
}

// Ejemplo de uso para recursos de biblioteca (docs, pdfs, imágenes)
export async function uploadResource(file, folder = "assets/library") {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const resourceType = file.type.split("/")[0] === "video" ? "video" : "auto";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("No fue posible subir el recurso.");

  const data = await response.json();
  return {
    link: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    folder: data.asset_folder ?? data.folder,
  };
}