import React, { useState, useEffect } from "react";
import CourseCard from "@/components/molecules/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadCourses = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleRetry = () => {
    loadCourses();
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (selectedCourse) {
        const updated = await coursesService.update(selectedCourse.Id, courseData);
        setCourses(prev => prev.map(c => c.Id === selectedCourse.Id ? updated : c));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await coursesService.create(courseData);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course created successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await coursesService.delete(courseId);
        setCourses(prev => prev.filter(c => c.Id !== courseId));
        toast.success("Course deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage your academic courses and track progress</p>
        </div>
        <Button onClick={handleAddCourse} variant="primary">
          <ApperIcon name="Plus" size={16} />
          Add Course
        </Button>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Empty
          title="No courses added yet"
          description="Start by adding your first course to begin tracking your academic progress"
          actionLabel="Add Course"
          onAction={handleAddCourse}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.Id} className="relative group">
              <CourseCard 
                course={course} 
                onClick={handleEditCourse}
                className="h-full"
              />
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(course);
                    }}
                    className="p-2 bg-white shadow-lg hover:bg-gray-50"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.Id);
                    }}
                    className="p-2 bg-white shadow-lg hover:bg-red-50 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCourse}
        course={selectedCourse}
      />
    </div>
  );
};

export default Courses;