import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment, courses }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    gradeCategory: "Homework"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm") : ""
      });
    } else {
      setFormData({
        title: "",
        courseId: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        gradeCategory: "Homework"
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.courseId) newErrors.courseId = "Course is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: course.name
  }));

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {assignment ? "Edit Assignment" : "Add New Assignment"}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              placeholder="Enter assignment title..."
            />

            <Select
              label="Course"
              value={formData.courseId}
              onChange={(e) => handleChange("courseId", e.target.value)}
              options={courseOptions}
              error={errors.courseId}
              placeholder="Select a course..."
            />

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional description..."
            />

            <Input
              label="Due Date"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              error={errors.dueDate}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                options={priorityOptions}
              />

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={statusOptions}
              />
            </div>

            <Input
              label="Grade Category"
              value={formData.gradeCategory}
              onChange={(e) => handleChange("gradeCategory", e.target.value)}
              placeholder="e.g., Homework, Quiz, Exam..."
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                <ApperIcon name="Save" size={16} />
                {assignment ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;