class CoursesService {
  constructor() {
    this.tableName = 'course_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "assignment_count_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error("Error fetching courses:", error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "letter_grade_c" } },
          { field: { Name: "assignment_count_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching course:", error);
      }
      throw error;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.Name || courseData.name,
            professor_c: courseData.professor_c || courseData.professor,
            credits_c: parseInt(courseData.credits_c || courseData.credits || 3),
            semester_c: courseData.semester_c || courseData.semester,
            color_c: courseData.color_c || courseData.color,
            current_grade_c: courseData.current_grade_c || courseData.currentGrade || null,
            letter_grade_c: courseData.letter_grade_c || courseData.letterGrade || null,
            assignment_count_c: courseData.assignment_count_c || courseData.assignmentCount || 0
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error("Error creating course:", error);
      }
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: courseData.Name || courseData.name,
            professor_c: courseData.professor_c || courseData.professor,
            credits_c: parseInt(courseData.credits_c || courseData.credits || 3),
            semester_c: courseData.semester_c || courseData.semester,
            color_c: courseData.color_c || courseData.color,
            current_grade_c: courseData.current_grade_c || courseData.currentGrade,
            letter_grade_c: courseData.letter_grade_c || courseData.letterGrade,
            assignment_count_c: courseData.assignment_count_c || courseData.assignmentCount
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error("Error updating course:", error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error("Error deleting course:", error);
      }
      throw error;
    }
  }
}

export const coursesService = new CoursesService();