const CLOUDINARY_CLOUD_NAME = "dd9iztlrv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function uploadVideo(file) {
  console.log("me ejecuto? antes primer if");
  if (!file || file.type.split("/")[0] !== "video") return null;
  console.log("me ejecuto? después if");

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


export async function uploadResource(file, folder = "library") {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", `assets/${folder}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("No fue posible subir el archivo.");

  const data = await response.json();
  return data.secure_url; // string simple, listo para guardarse como fileUrl
}