export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = (import.meta as ImportMeta & {
    env: Record<string, string | undefined>;
  }).env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = (import.meta as ImportMeta & {
    env: Record<string, string | undefined>;
  }).env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}