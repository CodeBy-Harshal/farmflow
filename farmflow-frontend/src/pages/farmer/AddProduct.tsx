import React, { useState } from "react";
import api from "../../utils/api";

interface ProductForm {
  name: string;
  category_id: string;
  unit_id: string;
  price: number;
  quantity_available: number;
  harvest_date: string;
  expiry_date: string;
  description: string;
  is_organic: boolean;
}

const categories = [
  { id: "1", name: "Grains" },
  { id: "2", name: "Vegetables" },
  { id: "3", name: "Fruits" },
  { id: "4", name: "Dairy" },
  { id: "5", name: "Pulses" },
];

const units = [
  { id: "1", name: "Kilogram", symbol: "kg" },
  { id: "2", name: "Litre", symbol: "L" },
  { id: "3", name: "Dozen", symbol: "doz" },
  { id: "4", name: "Gram", symbol: "g" },
];

const AddProduct: React.FC = () => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category_id: "",
    unit_id: "",
    price: 0,
    quantity_available: 0,
    harvest_date: "",
    expiry_date: "",
    description: "",
    is_organic: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handle file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.category_id) newErrors.category_id = "Please select a category";
    if (!form.unit_id) newErrors.unit_id = "Please select a unit";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (form.quantity_available <= 0)
      newErrors.quantity_available = "Quantity must be greater than 0";
    if (images.length === 0)
      newErrors.images = "Please upload at least one product image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, String(value))
      );

      // Append images
      images.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added (pending approval)!");
      setForm({
        name: "",
        category_id: "",
        unit_id: "",
        price: 0,
        quantity_available: 0,
        harvest_date: "",
        expiry_date: "",
        description: "",
        is_organic: false,
      });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg md:max-w-2xl mx-auto mt-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6"> Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            placeholder="e.g. Fresh Tomatoes"
            value={form.name}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category *</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm">{errors.category_id}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block font-medium mb-1">Unit *</label>
          <select
            name="unit_id"
            value={form.unit_id}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
          {errors.unit_id && (
            <p className="text-red-500 text-sm">{errors.unit_id}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price (₹) *</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={form.price || ""}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium mb-1">Quantity Available *</label>
          <input
            name="quantity_available"
            type="number"
            min="0"
            placeholder="e.g. 100"
            value={form.quantity_available || ""}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
          {errors.quantity_available && (
            <p className="text-red-500 text-sm">{errors.quantity_available}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Harvest Date</label>
            <input
              type="date"
              name="harvest_date"
              value={form.harvest_date}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Write product details..."
            value={form.description}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            rows={3}
          />
        </div>

        {/* Organic */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_organic"
            checked={form.is_organic}
            onChange={handleChange}
          />
          <span>Organic Product</span>
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-2">Product Images *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="border w-full p-2 rounded"
          />
          {errors.images && (
            <p className="text-red-500 text-sm">{errors.images}</p>
          )}

          {/* Preview */}
          <div className="flex flex-wrap gap-4 mt-3">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover rounded border"
                />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
