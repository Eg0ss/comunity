// src/components/blog/CreatePostModal.jsx
// Sert à la fois pour CRÉER (post=null) et MODIFIER (post fourni) une publication.
// AJOUTS par rapport à la version précédente :
//   - un champ d'upload d'image (optionnel)
//   - après une CRÉATION réussie (pas une modification), redirection vers "/"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseModal from "../ui/BaseModal";
import BaseInput from "../ui/BaseInput";
import BaseButton from "../ui/BaseButton";
import { createPost, updatePost, uploadPostImage } from "../../api/posts.api";
import { getCategories } from "../../api/categories.api";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";
import RichTextEditor from "./RichTextEditor";

const CreatePostModal = ({ isOpen, onClose, onSuccess, post = null }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isEditing = !!post;
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then(setCategories)
        .catch(() => toast.error("Erreur chargement catégories"))
        .finally(() => setLoadingCats(false));

      if (post) {
        setTitle(post.title || "");
        setContent(post.content || "");
        setSelectedCategories(post.categories?.map((c) => c.id) || []);
      } else {
        setTitle("");
        setContent("");
        setSelectedCategories([]);
      }
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen, post]);

  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentIsEmpty = content.replace(/<[^>]*>/g, "").trim() === "";
    if (!title.trim() || contentIsEmpty) {
      toast.error("Titre et contenu requis");
      return;
    }
    setLoading(true);
    try {
      let savedPost;
      if (isEditing) {
        savedPost = await updatePost(post.id, {
          title,
          content,
          category_ids: selectedCategories,
        });
        toast.success("Article mis à jour !");
      } else {
        savedPost = await createPost({
          title,
          content,
          category_ids: selectedCategories,
        });
        toast.success("Article créé !");
      }

      if (imageFile && savedPost?.id) {
        try {
          await uploadPostImage(savedPost.id, imageFile);
        } catch {
          toast.error(
            "L'article est publié, mais l'image n'a pas pu être envoyée",
          );
        }
      }

      onSuccess?.();
      onClose();

      if (!isEditing) {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier l'article" : "Nouvel article"}
    >
      <form onSubmit={handleSubmit}>
        <BaseInput
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'article"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image (optionnel)
          </label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-8 cursor-pointer hover:border-primary transition-colors text-gray-500">
              <FiImage size={24} />
              <span className="text-sm">Cliquez pour ajouter une image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégories
          </label>
          {loadingCats ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune catégorie disponible</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    selectedCategories.includes(cat.id)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-300 hover:border-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <BaseButton variant="primary" type="submit" disabled={loading}>
            {loading ? "..." : isEditing ? "Enregistrer" : "Publier"}
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreatePostModal;
