import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, onClick, className = "" }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "warning";
    if (grade >= 70) return "error";
    return "default";
  };

  return (
    <Card 
      hover 
      onClick={() => onClick?.(course)} 
      className={`p-6 cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: course.color }}
        ></div>
        {course.currentGrade && (
          <Badge variant={getGradeColor(course.currentGrade)} size="sm">
            {course.currentGrade.toFixed(1)}%
          </Badge>
        )}
      </div>
      
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2 line-clamp-2">
        {course.name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        {course.professor}
      </p>
      
      <div className="space-y-2">
        {course.schedule?.slice(0, 3).map((session, index) => (
          <div key={index} className="flex items-center justify-between text-xs text-gray-500">
            <span>{session.day}</span>
            <span>{session.time}</span>
          </div>
        ))}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{course.credits} Credits</span>
          <div className="flex items-center gap-1">
            <ApperIcon name="Users" size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">{course.semester}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;