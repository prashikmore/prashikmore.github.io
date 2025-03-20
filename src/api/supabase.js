import { supabase } from "../supabaseClient";

// Fetch Bio Data
export const fetchBioData = async () => {
  try {
    const { data, error } = await supabase.from("bio").select("*").single();

    if (error) throw error;

    // Optimize the image URL if present
    if (data?.Image) {
      data.Image = getOptimizedImageUrl(data.Image);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching bio data:", error);
    return { data: null, error };
  }
};

// Fetch Skills Data
export const fetchSkillsData = async () => {
  try {
    const { data, error } = await supabase.from("skills").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return { data: null, error };
  }
};

// Fetch Skills with Categories
export const fetchSkillsWithCategories = async () => {
  try {
    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from("skill_categories")
      .select("*")
      .order("id", { ascending: false });

    if (categoriesError) throw categoriesError;

    // Fetch skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .order("id", { ascending: true });

    if (skillsError) throw skillsError;

    // Map skills into categories
    const formattedSkills = categories.map((category) => ({
      id: category.id,
      title: category.title,
      skills: (skills || [])
        .filter((skill) => skill.category_id === category.id)
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          image: skill.image,
        })),
    }));

    return { data: formattedSkills, error: null };
  } catch (error) {
    console.error("Error fetching skills with categories:", error);
    return { data: [], error };
  }
};

// Fetch Projects Data
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return { data: null, error };
  }
};

// Fetch Experiences Data
export const fetchExperiences = async () => {
  try {
    const { data, error } = await supabase.from("experiences").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching experiences data:", error);
    return { data: null, error };
  }
};

// Fetch Education Data
export const fetchEducation = async () => {
  try {
    const { data, error } = await supabase.from("education").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching education data:", error);
    return { data: null, error };
  }
};

// Store Contact Form Data
export const storeContactData = async (contactData) => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .insert([contactData]);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error storing contact data:", error);
    return { data: null, error };
  }
};

export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return "";

  try {
    // If using Supabase Storage
    if (url.includes("supabase.co")) {
      // Add transformation parameters for Supabase Storage
      const optimizedUrl = new URL(url);
      optimizedUrl.searchParams.set("width", width.toString());
      optimizedUrl.searchParams.set("quality", "75");
      optimizedUrl.searchParams.set("format", "webp");
      return optimizedUrl.toString();
    }

    // If image is base64
    if (url.startsWith("data:image")) {
      return url;
    }

    // For external URLs, return as is
    return url;
  } catch (error) {
    console.error("Error optimizing image URL:", error);
    return url;
  }
};

// Fetch Copyright Data
export const fetchCopyrightData = async () => {
  try {
    const { data, error } = await supabase
      .from("copyright")
      .select("copyright")
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching copyright data:", error);
    return { data: null, error };
  }
};
