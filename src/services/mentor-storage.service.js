const MENTORS_KEY = "generationAlumniMentors";

const DEFAULT_MENTORS = [
  {
    about: "Administrador por defecto",
    createdAt: new Date().toISOString(),
    email: "admin@test.com",
    firstName: "Admin",
    generationProgram: "unity",
    id: 1000000000000,
    lastName: "Test",
    linkedin: "https://www.linkedin.com/in/test",
    mentorAreas: ["empleo", "cv", "entrevistas"],
    mentorType: ["chat", "cv"],
    password: "Test123*",
    profileImage: "",
    skills: ["javascript", "react"],
  },
];

export function seedMentorsIfEmpty() {
  const existing = localStorage.getItem(MENTORS_KEY);

  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(MENTORS_KEY, JSON.stringify(DEFAULT_MENTORS));
    console.log("✅ Mentores por defecto cargados");
  }
}