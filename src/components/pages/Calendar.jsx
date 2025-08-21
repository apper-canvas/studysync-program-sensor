import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { toast } from "react-toastify";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load calendar data. Please try again.");
      toast.error("Failed to load calendar data");
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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const getEventsForDate = (date) => {
    const assignmentEvents = getAssignmentsForDate(date);
    
    // Add class schedule events
    const dayName = format(date, "EEEE");
    const classEvents = courses.filter(course => 
      course.schedule?.some(session => session.day === dayName)
    );
    
    return [...assignmentEvents, ...classEvents];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the calendar to start on Sunday
  const startPadding = monthStart.getDay();
  const paddedDays = [];
  
  // Add previous month days
  for (let i = startPadding - 1; i >= 0; i--) {
    const prevDay = new Date(monthStart);
    prevDay.setDate(prevDay.getDate() - (i + 1));
    paddedDays.push(prevDay);
  }
  
  // Add current month days
  paddedDays.push(...monthDays);
  
  // Pad to fill the last week
  const totalDays = paddedDays.length;
  const remainingDays = 42 - totalDays; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const nextDay = new Date(monthEnd);
    nextDay.setDate(nextDay.getDate() + i);
    paddedDays.push(nextDay);
  }

  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View your assignments and class schedule</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant={view === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button 
            variant={view === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-surface-50 p-3 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {paddedDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const dayEvents = getEventsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const todayClass = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[80px] bg-white p-2 text-left hover:bg-gray-50 transition-colors duration-200
                      ${isSelected ? "bg-primary-50 border-2 border-primary-500" : ""}
                      ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                      ${todayClass ? "bg-primary-100" : ""}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${todayClass ? "w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center" : ""}
                    `}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event, eventIndex) => (
                        <div key={eventIndex} className="text-xs truncate">
                          {event.title ? (
                            <div className="bg-primary-100 text-primary-800 rounded px-1">
                              {event.title}
                            </div>
                          ) : (
                            <div className="bg-secondary-100 text-secondary-800 rounded px-1">
                              {event.name}
                            </div>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              {format(selectedDate, "EEEE, MMMM d")}
            </h3>
            
            {selectedDateAssignments.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Calendar" size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No assignments due</p>
                <p className="text-sm text-gray-500">Enjoy your free day!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateAssignments.map((assignment) => {
                  const course = courses.find(c => c.Id === parseInt(assignment.courseId));
                  return (
                    <div key={assignment.Id} className="p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: course?.color }}
                        />
                        <Badge variant={assignment.priority} size="xs">
                          {assignment.priority}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Legend */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Legend
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary-100 rounded"></div>
                <span className="text-sm text-gray-700">Assignments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-secondary-100 rounded"></div>
                <span className="text-sm text-gray-700">Classes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Today</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              This Month
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Assignments</span>
                <span className="font-medium text-gray-900">{assignments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">
                  {assignments.filter(a => a.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">
                  {assignments.filter(a => a.status === "pending").length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;