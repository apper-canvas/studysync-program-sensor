import coursesData from "@/services/mockData/courses.json";

class CoursesService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    await this.delay();
    return [...this.courses];
  }

  async getById(id) {
    await this.delay();
    const course = this.courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await this.delay();
    const maxId = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.Id)) : 0;
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      currentGrade: null,
      gradeCategories: courseData.gradeCategories || [
        { name: "Homework", weight: 0.3 },
        { name: "Quizzes", weight: 0.2 },
        { name: "Midterm", weight: 0.2 },
        { name: "Final", weight: 0.3 }
      ],
      schedule: courseData.schedule || []
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay();
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const coursesService = new CoursesService();