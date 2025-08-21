import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CourseModal = ({ isOpen, onClose, onSave, course }) => {
  const [formData, setFormData] = useState({
    name: "",
    professor: "",
    credits: 3,
    semester: "Fall 2024",
    color: "#4F46E5"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (course) {
      setFormData({ 
        name: course.name || "",
        professor: course.professor || "",
        credits: course.credits || 3,
        semester: course.semester || "Fall 2024",
        color: course.color || "#4F46E5"
      });
    } else {
      setFormData({
        name: "",
        professor: "",
        credits: 3,
        semester: "Fall 2024",
        color: "#4F46E5"
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.professor.trim()) newErrors.professor = "Professor name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const creditOptions = [
    { value: "1", label: "1 Credit" },
    { value: "2", label: "2 Credits" },
    { value: "3", label: "3 Credits" },
    { value: "4", label: "4 Credits" },
    { value: "5", label: "5 Credits" }
  ];

  const semesterOptions = [
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Winter 2024", label: "Winter 2024" }
  ];

  const colorOptions = [
    "#4F46E5", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", 
    "#10B981", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {course ? "Edit Course" : "Add New Course"}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Course Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              placeholder="e.g., Introduction to Psychology"
            />

            <Input
              label="Professor"
              value={formData.professor}
              onChange={(e) => handleChange("professor", e.target.value)}
              error={errors.professor}
              placeholder="e.g., Dr. Smith"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Credits"
                value={formData.credits.toString()}
                onChange={(e) => handleChange("credits", parseInt(e.target.value))}
                options={creditOptions}
              />

              <Select
                label="Semester"
                value={formData.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
                options={semesterOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      formData.color === color ? "border-gray-400 scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                <ApperIcon name="Save" size={16} />
                {course ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;