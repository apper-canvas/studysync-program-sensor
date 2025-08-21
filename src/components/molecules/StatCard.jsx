import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = "primary",
  className = "" 
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    accent: "text-accent-600 bg-accent-50",
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    error: "text-red-600 bg-red-50"
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-display font-bold text-gray-900 mb-2">
        {value}
      </div>
      
      <div className="text-sm text-gray-600">
        {title}
      </div>
    </Card>
  );
};

export default StatCard;