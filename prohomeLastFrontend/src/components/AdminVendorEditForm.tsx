import React, { useEffect, useState } from "react";
import styles from "../style/AdminVendorEditForm.module.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

interface VendorProfileForm {
  store_name: string;
  address1: string;
  store_phone: string;
  password?: string;
  image?: FileList;
  description?: string;
}

const AdminVendorEditForm: React.FC = () => {
  const { id: vendorId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, setValue } = useForm<VendorProfileForm>();
  const token = localStorage.getItem("token");

  const [statusMsg, setStatusMsg] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const vendors = useSelector((state: RootState) => state.products.vendors);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    if (vendors.length > 0 && vendorId) {
      const found = vendors.find((v) => v.store_id === vendorId);
      setVendor(found || null);
    }
  }, [vendors, vendorId]);

  useEffect(() => {
    if (vendor) {
      setValue("store_name", vendor.store_name);
      setValue("address1", vendor.address1);
      setValue("store_phone", vendor.store_phone);
      setValue("description", vendor.description || "");
      if (vendor.image) {
        setPreviewImage(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${vendor.image}`);
      }
    }
  }, [vendor, setValue]);

 const onSubmit = async (data: VendorProfileForm) => {
  try {
    const formData = new FormData();

    formData.append("store_name", data.store_name || vendor.store_name);
    formData.append("address1", data.address1 || vendor.address1);
    formData.append("store_phone", data.store_phone || vendor.store_phone);
    formData.append("description", data.description ?? vendor.description ?? "");

    if (data.password) formData.append("password", data.password);
    if (data.image && data.image.length > 0) formData.append("image", data.image[0]);

    // Other unchanged but required fields
    formData.append("firstName", vendor.first_name || "");
    formData.append("lastName", vendor.last_name || "");
    formData.append("brand_type", vendor.brand_type || "");
    formData.append("address2", vendor.address2 || "");
    formData.append("city", vendor.city || "");
    formData.append("state_county", vendor.state_county || "");
    formData.append("country", vendor.country || "");
    formData.append("postcode", vendor.postcode || "");

    // Debug: log all form fields
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

   const res = await axios.put(`/profile/update/${vendorId}`, formData, {

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data) {
      setStatusMsg("✅ Vendor profile updated successfully.");
    }
  } catch (error) {
    console.error("Update failed:", error);
    setStatusMsg("❌ Failed to update vendor profile.");
  }
};


  return (
    <div className={styles.vendorFormContainer}>
      <h2 className={styles.heading}>Edit Vendor Profile (Admin)</h2>

      {!vendor && <p className={styles.errorText}>Vendor not found.</p>}

      {vendor && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {previewImage && (
            <div className={styles.imagePreviewContainer}>
              <img src={previewImage} alt="Profile" className={styles.imagePreview} />
            </div>
          )}

          <div className={styles.imageUploadWrapper}>
            <label className={styles.label}>Profile Image:</label>
            <input
              type="file"
              className={styles.imageUploadInput}
              {...register("image")}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>

          <div>
            <label className={styles.label}>Store Name:</label>
            <input type="text" {...register("store_name")} className={styles.input} />
          </div>

          <div>
            <label className={styles.label}>Address:</label>
            <input type="text" {...register("address1")} className={styles.input} />
          </div>

          <div>
            <label className={styles.label}>Email:</label>
            <input type="email" value={vendor.email} disabled className={styles.disabledInput} />
          </div>

          <div>
            <label className={styles.label}>Phone:</label>
            <input type="text" {...register("store_phone")} className={styles.input} />
          </div>

          <div>
            <label className={styles.label}>Description:</label>
            <textarea
              {...register("description")}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Describe the vendor's business..."
            />
          </div>

          <div>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Optional – change password"
              className={styles.input}
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.button}>
              Update Profile
            </button>
          </div>

          {statusMsg && (
            <p className={statusMsg.includes("Failed") ? styles.errorText : styles.successText}>
              {statusMsg}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default AdminVendorEditForm;
