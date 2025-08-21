import React, { useState, useEffect } from "react";
import QuickStats from "@/components/molecules/QuickStats";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { calculateGPA } from "@/utils/grading";
import { formatDate, isOverdue } from "@/utils/date";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
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

  const handleToggleComplete = async (assignment) => {
    try {
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      const updated = await assignmentsService.update(assignment.Id, { 
        ...assignment, 
        status: newStatus 
      });
      
      setAssignments(prev => prev.map(a => 
        a.Id === assignment.Id ? updated : a
      ));
      
      toast.success(`Assignment ${newStatus === "completed" ? "completed" : "reopened"}`);
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  // Calculate statistics
  const stats = {
    gpa: calculateGPA(courses),
    activeCourses: courses.length,
    pendingAssignments: assignments.filter(a => a.status !== "completed").length,
    weeklyDeadlines: assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return dueDate <= nextWeek && dueDate >= new Date();
    }).length
  };

  // Get upcoming assignments (next 5 pending)
  const upcomingAssignments = assignments
    .filter(a => a.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Today's schedule
  const today = new Date();
  const todayClasses = courses.filter(course => 
    course.schedule?.some(session => 
      session.day === today.toLocaleDateString("en-US", { weekday: "long" })
    )
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome back, Student! 📚
        </h1>
        <p className="text-primary-100 text-lg">
          Let's make today productive. You have {stats.pendingAssignments} pending tasks.
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Upcoming Assignments
              </h2>
              <Button variant="outline" size="sm">
                <ApperIcon name="Plus" size={16} />
                Add Assignment
              </Button>
            </div>

            {upcomingAssignments.length === 0 ? (
              <Empty
                title="No upcoming assignments"
                description="Great job! You're all caught up."
                icon="CheckCircle2"
              />
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const course = courses.find(c => c.Id === parseInt(assignment.courseId));
                  return (
                    <AssignmentItem
                      key={assignment.Id}
                      assignment={assignment}
                      course={course}
                      onToggleComplete={handleToggleComplete}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Today's Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Classes */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h3>
            
            {todayClasses.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Calendar" size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No classes today</p>
                <p className="text-sm text-gray-500">Enjoy your free day!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((course) => {
                  const todaySessions = course.schedule?.filter(session =>
                    session.day === today.toLocaleDateString("en-US", { weekday: "long" })
                  );
                  
                  return todaySessions?.map((session, index) => (
                    <div key={`${course.Id}-${index}`} className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                        <p className="text-xs text-gray-600">{session.time}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.location}
                      </div>
                    </div>
                  ));
                })}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <ApperIcon name="Plus" size={16} />
                Add Assignment
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="BookOpen" size={16} />
                Add Course
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Calendar" size={16} />
                View Calendar
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="BarChart3" size={16} />
                Check Grades
              </Button>
            </div>
          </Card>

          {/* Motivation Card */}
          <Card className="p-6 bg-gradient-to-br from-accent-50 to-secondary-50 border-accent-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Trophy" size={24} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">
                You're doing great!
              </h3>
              <p className="text-sm text-gray-600">
                Your GPA is {stats.gpa.toFixed(2)}. Keep up the excellent work!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;