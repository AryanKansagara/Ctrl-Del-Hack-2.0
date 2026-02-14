import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPerson, createPerson, updatePerson, type Person } from "../api";
import { getDescriptorFromImage, loadFaceApiModels } from "../faceRecognition";
import { Layout, Card, Button, PageHeading, Input, Textarea } from "../components";

export default function PersonForm() {
  const { id } = useParams<"id">();
  const navigate = useNavigate();
  const isEdit = id != null;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [about, setAbout] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const p: Person = await getPerson(Number(id));
        setName(p.name);
        setRelationship(p.relationship);
        setAbout(p.about ?? "");
        if (p.photo_base64) setPhotoPreview(`data:image/jpeg;base64,${p.photo_base64}`);
      } catch (e) {
        setError("Could not load person.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setPhotoFile(f);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) {
      setError("Name and relationship are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await loadFaceApiModels();
      let photoBase64: string | null = null;
      let faceDescriptor: number[] | null = null;

      if (photoFile) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((res) => {
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(photoFile);
        });
        photoBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = dataUrl;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = rej;
        });
        const desc = await getDescriptorFromImage(img);
        if (desc) faceDescriptor = Array.from(desc);
      }

      if (isEdit) {
        await updatePerson(Number(id), {
          name: name.trim(),
          relationship: relationship.trim(),
          about: about.trim() || null,
          ...(photoBase64 != null && { photo_base64: photoBase64 }),
          ...(faceDescriptor != null && { face_descriptor: faceDescriptor }),
        });
      } else {
        if (!photoBase64 || !faceDescriptor) {
          setError("Please add a clear front-facing photo of the face for recognition.");
          setSaving(false);
          return;
        }
        await createPerson({
          name: name.trim(),
          relationship: relationship.trim(),
          about: about.trim() || null,
          photo_base64: photoBase64,
          face_descriptor: faceDescriptor,
        });
      }
      navigate("/people");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <PageHeading>{isEdit ? "Edit person" : "Add person"}</PageHeading>
          <Link
            to="/people"
            className="min-h-touch px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-card font-medium hover:border-gray-300 transition shadow-card inline-flex items-center justify-center"
          >
            Back
          </Link>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-600 bg-red-50 p-3 rounded-card text-sm">{error}</p>
            )}
            <div>
              <label className="block text-gray-900 font-medium mb-1">Name *</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-900 font-medium mb-1">Relationship *</label>
              <Input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Your daughter"
                required
              />
            </div>
            <div>
              <label className="block text-gray-900 font-medium mb-1">About (optional)</label>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-gray-900 font-medium mb-1">Photo * (clear, front-facing)</label>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full min-h-touch text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-card file:border-0 file:bg-recall-mint file:text-recall-green file:font-medium"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-card border border-gray-200"
                />
              )}
            </div>
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className="w-full"
            >
              {saving ? "Saving..." : isEdit ? "Save" : "Add person"}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
