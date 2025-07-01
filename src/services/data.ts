'use server';

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Project } from '@/lib/data';
import { skills as defaultSkills } from '@/lib/data';

export async function getProfileData(): Promise<{ skills: string[]; projects: Project[] }> {
  // Fetch Skills
  let skills: string[] = [];
  try {
    const skillsDocRef = doc(db, 'about', 'skillsData');
    const docSnap = await getDoc(skillsDocRef);
    if (docSnap.exists() && docSnap.data().list) {
      skills = docSnap.data().list;
    } else {
      skills = defaultSkills;
    }
  } catch (error) {
    console.error("Error fetching skills for resume generation: ", error);
    skills = defaultSkills; // Fallback
  }

  // Fetch Projects
  let projects: Project[] = [];
  try {
    const projectsCollection = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCollection);
    const allProjects = projectSnapshot.docs
      .map(doc => {
        const data = doc.data();
        if (
          typeof data.title !== 'string' ||
          typeof data.description !== 'string' ||
          typeof data.image !== 'string' ||
          !Array.isArray(data.tags) ||
          typeof data.link !== 'string'
        ) {
          return null;
        }
        return { id: doc.id, ...data } as Project;
      })
      .filter((p): p is Project => p !== null);

    // De-duplicate projects based on title to prevent duplicates in the resume.
    const uniqueProjects = new Map<string, Project>();
    for (const project of allProjects) {
        if (!uniqueProjects.has(project.title)) {
            uniqueProjects.set(project.title, project);
        }
    }
    projects = Array.from(uniqueProjects.values());

  } catch (error) {
    console.error("Error fetching projects for resume generation: ", error);
    projects = []; // Fallback
  }

  return { skills, projects };
}
