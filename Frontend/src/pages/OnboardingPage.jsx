import { useState } from "react";
import {
  ShipWheelIcon,
  MapPinIcon,
  GlobeIcon,
  ShuffleIcon,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
  });

  const { mutate: onboardMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardMutation(formData);
  };

  const handleRandomLocation = () => {
    const locations = [
      "New York, USA",
      "London, UK",
      "Tokyo, Japan",
      "Paris, France",
      "Sydney, Australia",
      "Mumbai, India",
      "Berlin, Germany",
      "Toronto, Canada",
    ];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    setFormData({ ...formData, location: randomLocation });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest">
      <div className="border border-primary/25 flex flex-col w-full max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              LiveLink
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
            <p className="text-sm opacity-70 mt-1">
              Tell us about yourself to find the perfect language partners
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* FULLNAME */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input input-bordered w-full"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* BIO */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  placeholder="Tell us about yourself and your language learning goals..."
                  className="textarea textarea-bordered w-full h-24"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  required
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <GlobeIcon className="size-4" />
                      Native Language
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.nativeLanguage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nativeLanguage: e.target.value,
                      })
                    }
                    required>
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <GlobeIcon className="size-4" />
                      Learning Language
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.learningLanguage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        learningLanguage: e.target.value,
                      })
                    }
                    required>
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <MapPinIcon className="size-4" />
                    Location
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="input input-bordered w-full"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRandomLocation}>
                    <ShuffleIcon className="size-4" />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary w-full mt-4"
                type="submit"
                disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
