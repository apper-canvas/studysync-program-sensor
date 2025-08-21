import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { calculateGPA, calculateCourseGrade, getLetterGrade, formatGPA } from "@/utils/grading";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [coursesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetry = () => {
    loadData();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  const overallGPA = calculateGPA(courses);
  
  // Calculate grades for each course based on assignments
  const coursesWithGrades = courses.map(course => {
    const courseAssignments = assignments.filter(a => 
      parseInt(a.courseId) === course.Id && a.grade !== null && a.grade !== undefined
    );
    
    let courseGrade = null;
    if (courseAssignments.length > 0) {
      const totalPoints = courseAssignments.reduce((sum, a) => sum + a.grade, 0);
      courseGrade = totalPoints / courseAssignments.length;
    }
    
    return {
      ...course,
      currentGrade: courseGrade,
      letterGrade: courseGrade ? getLetterGrade(courseGrade) : null,
      assignmentCount: courseAssignments.length,
      assignments: courseAssignments
    };
  });

  const getGradeColor = (grade) => {
    if (!grade) return "default";
    if (grade >= 90) return "success";
    if (grade >= 80) return "warning";
    if (grade >= 70) return "error";
    return "error";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">Track your academic performance and GPA</p>
        </div>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div className="text-3xl font-display font-bold text-gray-900 mb-2">
              {formatGPA(overallGPA)}
            </div>
            <div className="text-sm text-gray-600">Current GPA</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
            </div>
            <div className="text-3xl font-display font-bold text-gray-900 mb-2">
              {coursesWithGrades.filter(c => c.currentGrade >= 90).length}
            </div>
            <div className="text-sm text-gray-600">A Grades</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BookOpen" size={24} className="text-blue-600" />
            </div>
            <div className="text-3xl font-display font-bold text-gray-900 mb-2">
              {courses.length}
            </div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Course Grades
            </h2>

            {coursesWithGrades.length === 0 ? (
              <Empty
                title="No courses found"
                description="Add some courses to start tracking your grades"
                icon="BookOpen"
              />
            ) : (
              <div className="space-y-4">
                {coursesWithGrades.map((course) => (
                  <div
                    key={course.Id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                      selectedCourse?.Id === course.Id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">
                            {course.professor} • {course.credits} credits
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {course.currentGrade !== null ? (
                          <>
                            <Badge 
                              variant={getGradeColor(course.currentGrade)} 
                              size="md"
                            >
                              {course.letterGrade}
                            </Badge>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {course.currentGrade.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {course.assignmentCount} assignments
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-sm">No grades yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Course Details */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              {selectedCourse ? selectedCourse.name : "Select a Course"}
            </h3>

            {selectedCourse ? (
              <div className="space-y-4">
                {/* Course Info */}
                <div className="p-4 bg-surface-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Professor:</span>
                      <div className="font-medium">{selectedCourse.professor}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Credits:</span>
                      <div className="font-medium">{selectedCourse.credits}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Grade:</span>
                      <div className="font-medium">
                        {selectedCourse.currentGrade !== null
                          ? `${selectedCourse.currentGrade.toFixed(1)}% (${selectedCourse.letterGrade})`
                          : "No grades yet"
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Semester:</span>
                      <div className="font-medium">{selectedCourse.semester}</div>
                    </div>
                  </div>
                </div>

                {/* Recent Assignments */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Grades</h4>
                  {selectedCourse.assignments?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCourse.assignments.slice(0, 5).map((assignment) => (
                        <div
                          key={assignment.Id}
                          className="flex justify-between items-center p-2 bg-surface-50 rounded"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {assignment.title}
                          </span>
                          <Badge variant={getGradeColor(assignment.grade)} size="xs">
                            {assignment.grade}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No graded assignments yet</p>
                  )}
                </div>

                {/* Grade Distribution */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Grade Breakdown</h4>
                  <div className="space-y-2">
                    {selectedCourse.gradeCategories?.map((category) => (
                      <div key={category.name} className="flex justify-between text-sm">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium">{category.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Select a course to view detailed grades</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Grades;