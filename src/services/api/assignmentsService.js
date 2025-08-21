class AssignmentsService {
  constructor() {
    this.tableName = 'assignment_c';
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
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "grade_category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
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
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments:", error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "grade_category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } }
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
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching assignment:", error);
      }
      throw error;
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "grade_category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments by course:", error);
      }
      throw error;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            Name: assignmentData.Name || assignmentData.name || assignmentData.title_c || assignmentData.title,
            title_c: assignmentData.title_c || assignmentData.title,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId),
            description_c: assignmentData.description_c || assignmentData.description || "",
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            grade_c: assignmentData.grade_c || assignmentData.grade || null,
            grade_category_c: assignmentData.grade_category_c || assignmentData.gradeCategory || "Homework",
            priority_c: assignmentData.priority_c || assignmentData.priority || "medium",
            status_c: assignmentData.status_c || assignmentData.status || "pending"
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
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error creating assignment:", error);
      }
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: assignmentData.Name || assignmentData.name || assignmentData.title_c || assignmentData.title,
            title_c: assignmentData.title_c || assignmentData.title,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId),
            description_c: assignmentData.description_c || assignmentData.description,
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            grade_c: assignmentData.grade_c || assignmentData.grade,
            grade_category_c: assignmentData.grade_category_c || assignmentData.gradeCategory,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            status_c: assignmentData.status_c || assignmentData.status
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
          console.error(`Failed to update assignment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error updating assignment:", error);
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
          console.error(`Failed to delete assignment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting assignment:", error);
      }
      throw error;
    }
  }
}

export const assignmentsService = new AssignmentsService();