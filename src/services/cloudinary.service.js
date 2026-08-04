<<<<<<< HEAD
=======
//dd9iztlrv
//dkfb1wppj
>>>>>>> f6f2dbc194c22d6f3be281784e22fb374bc14a63
const CLOUDINARY_CLOUD_NAME = "dkfb1wppj";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function uploadVideo(file, folder = "assets/recording") {
  if (!file || file.type.split("/")[0] !== "video") return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
<<<<<<< HEAD
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: "POST", body: formData }
  );
=======
  formData.append("folder", "assets/recording/");
>>>>>>> f6f2dbc194c22d6f3be281784e22fb374bc14a63

  if (!response.ok) throw new Error("No fue posible subir el video.");

  const data = await response.json();
  return {
    link: data.secure_url,
    thumbnail: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${data.public_id}.jpg`,
    publicId: data.public_id,
    folder: data.asset_folder ?? data.folder,
  };
}

<<<<<<< HEAD
// Ejemplo de uso para recursos de biblioteca (docs, pdfs, imágenes)
export async function uploadResource(file, folder = "assets/library") {
=======
export async function uploadImage(file) {
  if (!file || file.type.split("/")[0] !== "image") return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "assets/image/");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("No fue posible subir la imagen.");

  const data = await response.json();
  return { url: data.secure_url };
}

export async function uploadResource(file) {
>>>>>>> f6f2dbc194c22d6f3be281784e22fb374bc14a63
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
<<<<<<< HEAD
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
=======
  formData.append("folder", "assets/library/");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("No fue posible subir el archivo.");

  const data = await response.json();
  return data.secure_url; // string simple, listo para guardarse como fileUrl
>>>>>>> f6f2dbc194c22d6f3be281784e22fb374bc14a63
}