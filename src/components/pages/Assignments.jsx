import React, { useState, useEffect } from "react";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

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
      setError("Failed to load assignments. Please try again.");
      toast.error("Failed to load assignments");
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

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (selectedAssignment) {
        const updated = await assignmentsService.update(selectedAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === selectedAssignment.Id ? updated : a));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentsService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment created successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
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

  const handleDeleteAssignment = async (assignment) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentsService.delete(assignment.Id);
        setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
        toast.success("Assignment deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || assignment.status === statusFilter;
    const matchesCourse = !courseFilter || assignment.courseId === courseFilter;
    const matchesPriority = !priorityFilter || assignment.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesPriority;
  });

  // Sort by due date
  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const courseOptions = [
    { value: "", label: "All Courses" },
    ...courses.map(course => ({
      value: course.Id.toString(),
      label: course.name
    }))
  ];

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === "pending").length,
    inProgress: assignments.filter(a => a.status === "in-progress").length,
    completed: assignments.filter(a => a.status === "completed").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage all your assignments</p>
        </div>
        <Button onClick={handleAddAssignment} variant="primary">
          <ApperIcon name="Plus" size={16} />
          Add Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">{stats.inProgress}</div>
          <div className="text-sm text-blue-600">In Progress</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.completed}</div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
          
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            options={courseOptions}
          />
          
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={priorityOptions}
          />
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCourseFilter("");
              setPriorityFilter("");
            }}
            className="w-full"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Clear
          </Button>
        </div>
      </div>

      {/* Assignments List */}
      {sortedAssignments.length === 0 ? (
        <Empty
          title={filteredAssignments.length === 0 && assignments.length > 0 ? 
            "No assignments match your filters" : 
            "No assignments yet"
          }
          description={filteredAssignments.length === 0 && assignments.length > 0 ? 
            "Try adjusting your filters to see more assignments" : 
            "Create your first assignment to get started"
          }
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
          icon="CheckSquare"
        />
      ) : (
        <div className="space-y-4">
          {sortedAssignments.map((assignment) => {
            const course = courses.find(c => c.Id === parseInt(assignment.courseId));
            return (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAssignment}
        assignment={selectedAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;