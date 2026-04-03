import React from "react";
import { supabase } from "../../lib/supabase";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  interest_area: string;
  discovery_source: string;
  linkedin_url: string;
}

interface FormErrors {
  [key: string]: string;
}

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const getBorderColor = () => {
    if (error) return "#EB0028";
    if (isFocused || isHovered) return "#EB0028";
    return "#1F1F1F";
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300"
        style={{ letterSpacing: "0", textAlign: "left" }}
      >
        {label} {required && <span className="text-[#EB0028]">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        placeholder={placeholder}
        style={{
          transition: "border-color 0.3s ease",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: getBorderColor(),
          backgroundColor: "#0E0E0E",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          width: "100%",
          color: "#FFFFFF",
          outline: "none",
          letterSpacing: "0",
        }}
        required={required}
      />
      {error && (
        <p
          className="text-[#EB0028] text-sm mt-1"
          style={{ letterSpacing: "0", textAlign: "left" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const getBorderColor = () => {
    if (error) return "#EB0028";
    if (isFocused || isHovered) return "#EB0028";
    return "#1F1F1F";
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300"
        style={{ letterSpacing: "0", textAlign: "left" }}
      >
        {label} {required && <span className="text-[#EB0028]">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: "border-color 0.3s ease",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: getBorderColor(),
          backgroundColor: "#0E0E0E",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          width: "100%",
          color: "#FFFFFF",
          outline: "none",
          letterSpacing: "0",
        }}
        required={required}
      >
        <option
          value=""
          style={{ backgroundColor: "#0E0E0E", color: "#FFFFFF" }}
        >
          Select an option
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            style={{ backgroundColor: "#0E0E0E", color: "#FFFFFF" }}
          >
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p
          className="text-[#EB0028] text-sm mt-1"
          style={{ letterSpacing: "0", textAlign: "left" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

const CommunityRegistrationPage: React.FC = () => {
  React.useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.backgroundColor = "#000000";

    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  const [formData, setFormData] = React.useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    interest_area: "",
    discovery_source: "",
    linkedin_url: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.organization.trim())
      newErrors.organization = "Organization/Affiliation is required";
    if (!formData.interest_area)
      newErrors.interest_area = "Please select an interest area";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    try {
      // 1. Get the current event ID from settings table
      const { data: settings } = await supabase
        .from("settings")
        .select("current_event_id")
        .single();

      const eventId = settings?.current_event_id;

      // 2. Insert into the new community_members table
      const { error } = await supabase.from("community_members").insert([
        {
          event_id: eventId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          interest_area: formData.interest_area,
          discovery_source: formData.discovery_source,
          linkedin_url: formData.linkedin_url,
          status: "Active",
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");

      // Cleanup logic
      setTimeout(() => {
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          organization: "",
          interest_area: "",
          discovery_source: "",
          linkedin_url: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  const interestOptions = [
    "Attending Future Events",
    "Speaker Opportunities",
    "Partnership/Sponsorship",
    "Workshops & Networking",
    "Newsletter & Updates",
  ];

  const sourceOptions = [
    "Social Media",
    "University Announcement",
    "Friend/Colleague",
    "Previous TEDx Events",
    "Search Engine",
  ];

  return (
    <>
      <style>{`
        body, html, #root { background-color: #000000 !important; margin: 0 !important; padding: 0 !important; }
        ::placeholder { color: #6B7280; opacity: 1; }
        * { letter-spacing: 0 !important; }
      `}</style>

      <div
        style={{
          backgroundColor: "#000000",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="bg-black py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1
                className="text-4xl sm:text-5xl font-bold mb-4 relative"
                style={{ color: "#FFFFFF" }}
              >
                Join the
                <span className="text-primary"> TED</span>
                <span className="text-primary absolute top-[-20%] ">x</span>
                <span className="opacity-0">x</span>
                <span className="font-normal"> UoK </span>Community
              </h1>
              <p className="text-gray-400 text-lg">
                Connect with thinkers, doers, and change-makers in our
                ecosystem.
              </p>
            </div>

            {submitStatus === "success" && (
              <div className="mb-8 bg-green-900/20 border border-green-500 rounded-xl p-6 flex items-start space-x-4">
                <svg
                  className="w-8 h-8 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-300">
                    Welcome to the TEDxUoK community. We'll be in touch soon
                    with exclusive updates.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-8 p-4 bg-red-900/20 border border-[#EB0028] rounded-lg flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-[#EB0028]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="text-white font-bold">
                  Registration Failed. Please check your details and try again.
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-8 space-y-8"
            >
              {/* Section 1: Personal Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-[#EB0028] pl-3">
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.full_name}
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    error={errors.email}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 XX XXX XXXX"
                    required={false}
                  />
                  <FormInput
                    label="Organization / University"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company or Faculty name"
                    error={errors.organization}
                  />
                </div>
              </div>

              {/* Section 2: Engagement */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-[#EB0028] pl-3">
                  Engagement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Primary Interest"
                    name="interest_area"
                    value={formData.interest_area}
                    onChange={handleChange}
                    options={interestOptions}
                    error={errors.interest_area}
                  />
                  <FormSelect
                    label="How did you hear about us?"
                    name="discovery_source"
                    value={formData.discovery_source}
                    onChange={handleChange}
                    options={sourceOptions}
                    required={false}
                  />
                </div>
                <FormInput
                  label="LinkedIn Profile URL"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  required={false}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitStatus === "success"}
                  className="w-full bg-[#EB0028] py-4 rounded-lg font-bold text-lg hover:bg-[#c7001f] transition-all shadow-lg"
                  style={{ color: "#FFFFFF" }}
                >
                  Join Community
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">
                  By joining, you agree to receive updates from TEDxUoK
                  regarding events and community news.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityRegistrationPage;
