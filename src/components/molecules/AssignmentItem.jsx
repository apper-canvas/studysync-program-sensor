import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, isOverdue, getDaysUntilDue } from "@/utils/date";

const AssignmentItem = ({ assignment, course, onToggleComplete, onEdit, onDelete, className = "" }) => {
  const daysUntil = getDaysUntilDue(assignment.dueDate);
  const overdue = isOverdue(assignment.dueDate);
  
  const getPriorityVariant = () => {
    if (overdue) return "overdue";
    if (assignment.priority === "high" || daysUntil <= 1) return "high";
    if (assignment.priority === "medium" || daysUntil <= 3) return "medium";
    return "low";
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case "completed":
        return "CheckCircle2";
      case "in-progress":
        return "Clock";
      default:
        return "Circle";
    }
  };

  return (
    <Card className={`p-4 ${assignment.status === "completed" ? "opacity-75" : ""} ${className}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete?.(assignment)}
          className="mt-1 text-gray-400 hover:text-primary-500 transition-colors duration-200"
        >
          <ApperIcon 
            name={getStatusIcon()} 
            size={20} 
            className={assignment.status === "completed" ? "text-green-500" : ""} 
          />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-medium text-gray-900 ${assignment.status === "completed" ? "line-through" : ""}`}>
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600">{course?.name}</p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={getPriorityVariant()} size="xs">
                {overdue ? "Overdue" : formatDate(assignment.dueDate)}
              </Badge>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(assignment)}
                  className="p-1.5"
                >
                  <ApperIcon name="Edit2" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(assignment)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
          
          {assignment.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: course?.color }}
              ></div>
              <span>{assignment.gradeCategory}</span>
            </div>
            
            {assignment.grade && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Star" size={12} />
                <span>{assignment.grade}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentItem;