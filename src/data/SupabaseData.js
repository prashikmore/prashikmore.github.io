import { supabase } from "../supabaseClient";

// Fetch Bio Data
export const fetchBioData = async () => {
  try {
    const { data, error } = await supabase.from("bio").select("*").single();
    if (error) throw error;
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

// Fetch Projects Data
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*,members(*),associations(*)");
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
