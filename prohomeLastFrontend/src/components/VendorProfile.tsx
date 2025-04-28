import React, { useEffect, useState } from "react";
import styles from "../style/VendorProfile.module.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface VendorProfileProps {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  about?: string;
  description?: string;
}

interface VendorProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  image?: FileList;
  description?: string;
}

const VendorProfile: React.FC = () => {
  const [vendor, setVendor] = useState<VendorProfileProps | null>(null);
  const { register, handleSubmit, setValue } = useForm<VendorProfileForm>();
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchVendorProfile = async () => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const res = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendor(res.data);

      // Prefill form fields
      setValue("firstName", res.data.firstName);
      setValue("lastName", res.data.lastName);
      setValue("phone", res.data.phone);
      setValue("description", res.data.description || ""); // Prefill description

      if (res.data.image) {
        setPreviewImage(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${res.data.image}`);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
    }
  };

  useEffect(() => {
    fetchVendorProfile();
  }, [setValue]);

  const onSubmit = async (data: VendorProfileForm) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phone", data.phone);
      if (data.password) {
        formData.append("password", data.password);
      }
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      if (data.description) {
        formData.append("description", data.description);
      }

      const response = await axios.put("/profile/update2", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setUpdateStatus("Profile updated successfully ✅");
        fetchVendorProfile();
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdateStatus("❌ Failed to update profile");
    }
  };

  return (
    <div className={`${styles.vendorprofile1} max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6`}>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Vendor Profile</h2>

      {previewImage && (
        <div className="flex justify-center mb-6">
          <img src={previewImage} alt="Profile" className={`${styles.vendorprofile2} w-32 h-32 rounded-full shadow-md`} />
        </div>
      )}

      {vendor ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="flex flex-col justify-center align-center">
            <label className="font-semibold">Profile Image:</label>
            <input type="file" className="border p-2 rounded mt-1" {...register("image")} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">First Name:</label>
            <input type="text" {...register("firstName")} className="border p-2 rounded mt-1" />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Last Name:</label>
            <input type="text" {...register("lastName")} className="border p-2 rounded mt-1" />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Email:</label>
            <input type="email" defaultValue={vendor.email} disabled className="border p-2 rounded mt-1 bg-gray-100" />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Phone:</label>
            <input type="text" {...register("phone")} className="border p-2 rounded mt-1" />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Description:</label>
            <textarea
  {...register("description")}
  className={`border p-2 rounded mt-1 placeholder-gray-500 ${styles["textarea-small"]}`}
  placeholder="Tell us about your store..."
/>
</div>

          <div className="flex flex-col">
            <label className="font-semibold">Password:</label>
            <input type="password" {...register("password")} placeholder="Leave blank to keep current password" className="border p-2 rounded mt-1" />
          </div>

          <div className="flex justify-center mx-auto">
            <button type="submit" className={`${styles.vendorprofilesubmit} m-4 w-50 bg-green-500 text-white font-semibold py-2 rounded-full shadow-md hover:bg-green-600 transition duration-200`}>
              Update Profile
            </button>
          </div>

          {updateStatus && (
            <p className={`text-center mt-3 ${updateStatus.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
              {updateStatus}
            </p>
          )}
        </form>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default VendorProfile;
