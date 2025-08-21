import React from "react";
import StatCard from "@/components/molecules/StatCard";

const QuickStats = ({ stats, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
      <StatCard
        title="Current GPA"
        value={stats.gpa.toFixed(2)}
        icon="GraduationCap"
        color="primary"
        trend={{ value: "+0.2", positive: true }}
      />
      
      <StatCard
        title="Active Courses"
        value={stats.activeCourses}
        icon="BookOpen"
        color="secondary"
      />
      
      <StatCard
        title="Pending Tasks"
        value={stats.pendingAssignments}
        icon="CheckSquare"
        color="warning"
      />
      
      <StatCard
        title="This Week"
        value={stats.weeklyDeadlines}
        icon="Calendar"
        color="accent"
      />
    </div>
  );
};

export default QuickStats;