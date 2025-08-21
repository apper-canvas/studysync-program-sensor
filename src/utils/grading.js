export const calculateGPA = (courses) => {
  if (!courses || courses.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const courseGrade = calculateCourseGrade(course);
    if (courseGrade !== null) {
      totalPoints += getGradePoints(courseGrade) * course.credits;
      totalCredits += course.credits;
    }
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const calculateCourseGrade = (course) => {
  if (!course.gradeCategories || course.gradeCategories.length === 0) {
    return null;
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  course.gradeCategories.forEach(category => {
    const categoryGrades = getCategoryGrades(course.Id, category.name);
    if (categoryGrades.length > 0) {
      const categoryAverage = categoryGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / categoryGrades.length;
      totalWeightedScore += categoryAverage * category.weight;
      totalWeight += category.weight;
    }
  });

  return totalWeight > 0 ? totalWeightedScore / totalWeight : null;
};

export const getCategoryGrades = (courseId, categoryName) => {
  // This would typically fetch from your grades service
  // For now, return empty array as placeholder
  return [];
};

export const getGradePoints = (percentage) => {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 3.7;
  if (percentage >= 90) return 3.3;
  if (percentage >= 87) return 3.0;
  if (percentage >= 83) return 2.7;
  if (percentage >= 80) return 2.3;
  if (percentage >= 77) return 2.0;
  if (percentage >= 73) return 1.7;
  if (percentage >= 70) return 1.3;
  if (percentage >= 67) return 1.0;
  if (percentage >= 65) return 0.7;
  return 0.0;
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 65) return "D";
  return "F";
};

export const formatGPA = (gpa) => {
  return gpa.toFixed(2);
};