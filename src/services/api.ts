
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for development
const mockData = {
  // Teacher's assigned courses and classes
  assignments: {
    'T001': [
      { 
        course_id: 'CS101', 
        course_name: 'Introduction to Programming',
        class_id: 'CSE-2023-A',
        semester: 3,
        total_students: 45,
        schedule: 'Mon, Wed 10:00 AM'
      },
      { 
        course_id: 'CS201', 
        course_name: 'Data Structures',
        class_id: 'CSE-2022-A',
        semester: 5,
        total_students: 40,
        schedule: 'Tue, Thu 2:00 PM'
      },
      { 
        course_id: 'CS301', 
        course_name: 'Database Systems',
        class_id: 'CSE-2021-B',
        semester: 7,
        total_students: 35,
        schedule: 'Fri 1:00 PM'
      }
    ]
  },

  // Students in a class
  students: {
    'CSE-2023-A': [
      { roll_number: 'CSE2023001', name: 'Aiden Smith', email: 'aiden@college.edu' },
      { roll_number: 'CSE2023002', name: 'Bella Johnson', email: 'bella@college.edu' },
      { roll_number: 'CSE2023003', name: 'Carlos Rodriguez', email: 'carlos@college.edu' },
      { roll_number: 'CSE2023004', name: 'Diana Chen', email: 'diana@college.edu' },
      { roll_number: 'CSE2023005', name: 'Ethan Williams', email: 'ethan@college.edu' }
    ],
    'CSE-2022-A': [
      { roll_number: 'CSE2022001', name: 'Fiona Garcia', email: 'fiona@college.edu' },
      { roll_number: 'CSE2022002', name: 'George Patel', email: 'george@college.edu' },
      { roll_number: 'CSE2022003', name: 'Hannah Kim', email: 'hannah@college.edu' },
      { roll_number: 'CSE2022004', name: 'Ian Nguyen', email: 'ian@college.edu' },
      { roll_number: 'CSE2022005', name: 'Julia Martinez', email: 'julia@college.edu' }
    ],
    'CSE-2021-B': [
      { roll_number: 'CSE2021011', name: 'Kevin Brown', email: 'kevin@college.edu' },
      { roll_number: 'CSE2021012', name: 'Lily Taylor', email: 'lily@college.edu' },
      { roll_number: 'CSE2021013', name: 'Miguel Hernandez', email: 'miguel@college.edu' },
      { roll_number: 'CSE2021014', name: 'Nina Wilson', email: 'nina@college.edu' },
      { roll_number: 'CSE2021015', name: 'Oliver Davis', email: 'oliver@college.edu' }
    ]
  },

  // Attendance data for a class
  attendance_summary: {
    'CSE-2023-A': [
      { roll_number: 'CSE2023001', name: 'Aiden Smith', attendance_percent: 85, total_classes: 20, attended_classes: 17 },
      { roll_number: 'CSE2023002', name: 'Bella Johnson', attendance_percent: 90, total_classes: 20, attended_classes: 18 },
      { roll_number: 'CSE2023003', name: 'Carlos Rodriguez', attendance_percent: 60, total_classes: 20, attended_classes: 12 },
      { roll_number: 'CSE2023004', name: 'Diana Chen', attendance_percent: 45, total_classes: 20, attended_classes: 9 },
      { roll_number: 'CSE2023005', name: 'Ethan Williams', attendance_percent: 75, total_classes: 20, attended_classes: 15 }
    ],
    'CSE-2022-A': [
      { roll_number: 'CSE2022001', name: 'Fiona Garcia', attendance_percent: 95, total_classes: 25, attended_classes: 24 },
      { roll_number: 'CSE2022002', name: 'George Patel', attendance_percent: 72, total_classes: 25, attended_classes: 18 },
      { roll_number: 'CSE2022003', name: 'Hannah Kim', attendance_percent: 48, total_classes: 25, attended_classes: 12 },
      { roll_number: 'CSE2022004', name: 'Ian Nguyen', attendance_percent: 80, total_classes: 25, attended_classes: 20 },
      { roll_number: 'CSE2022005', name: 'Julia Martinez', attendance_percent: 68, total_classes: 25, attended_classes: 17 }
    ],
    'CSE-2021-B': [
      { roll_number: 'CSE2021011', name: 'Kevin Brown', attendance_percent: 88, total_classes: 30, attended_classes: 26 },
      { roll_number: 'CSE2021012', name: 'Lily Taylor', attendance_percent: 73, total_classes: 30, attended_classes: 22 },
      { roll_number: 'CSE2021013', name: 'Miguel Hernandez', attendance_percent: 40, total_classes: 30, attended_classes: 12 },
      { roll_number: 'CSE2021014', name: 'Nina Wilson', attendance_percent: 83, total_classes: 30, attended_classes: 25 },
      { roll_number: 'CSE2021015', name: 'Oliver Davis', attendance_percent: 67, total_classes: 30, attended_classes: 20 }
    ]
  },

  // Student's attendance across all courses
  student_attendance: {
    'CSE2023003': [
      { course_id: 'CS101', course_name: 'Introduction to Programming', attendance_percent: 60, total_classes: 20, attended_classes: 12 },
      { course_id: 'MATH101', course_name: 'Calculus I', attendance_percent: 55, total_classes: 18, attended_classes: 10 },
      { course_id: 'PHY101', course_name: 'Physics I', attendance_percent: 70, total_classes: 15, attended_classes: 10 },
      { course_id: 'ENG101', course_name: 'Technical Communication', attendance_percent: 80, total_classes: 10, attended_classes: 8 }
    ],
    'CSE2022003': [
      { course_id: 'CS201', course_name: 'Data Structures', attendance_percent: 48, total_classes: 25, attended_classes: 12 },
      { course_id: 'CS202', course_name: 'Computer Architecture', attendance_percent: 52, total_classes: 25, attended_classes: 13 },
      { course_id: 'MATH201', course_name: 'Discrete Mathematics', attendance_percent: 60, total_classes: 20, attended_classes: 12 },
      { course_id: 'CS203', course_name: 'Operating Systems', attendance_percent: 72, total_classes: 25, attended_classes: 18 }
    ]
  },

  // Previous semester reports
  previous_reports: {
    'CSE2022003': {
      student_name: 'Hannah Kim',
      current_semester: 5,
      cgpa: 7.2,
      semester_results: [
        {
          semester: 4,
          sgpa: 7.5,
          subjects: [
            { code: 'CS205', name: 'Software Engineering', grade: 'B', credits: 4, status: 'Pass' },
            { code: 'CS206', name: 'Computer Networks', grade: 'C', credits: 4, status: 'Pass' },
            { code: 'CS207', name: 'Theory of Computation', grade: 'B+', credits: 3, status: 'Pass' },
            { code: 'MATH204', name: 'Probability and Statistics', grade: 'F', credits: 3, status: 'Fail' }
          ]
        },
        {
          semester: 3,
          sgpa: 6.8,
          subjects: [
            { code: 'CS201', name: 'Data Structures', grade: 'B', credits: 4, status: 'Pass' },
            { code: 'CS202', name: 'Computer Architecture', grade: 'C+', credits: 4, status: 'Pass' },
            { code: 'MATH201', name: 'Discrete Mathematics', grade: 'B-', credits: 3, status: 'Pass' },
            { code: 'CS203', name: 'Operating Systems', grade: 'C', credits: 4, status: 'Pass' }
          ]
        }
      ],
      backlog_subjects: [
        { code: 'MATH204', name: 'Probability and Statistics', semester: 4, credits: 3 }
      ],
      semester_wise_cgpa: [
        { semester: 1, cgpa: 8.2 },
        { semester: 2, cgpa: 7.5 },
        { semester: 3, cgpa: 6.8 },
        { semester: 4, cgpa: 7.5 }
      ]
    }
  }
};

// Mock API functions
export const mockApi = {
  login: async (teacherId: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success for any valid-looking ID
    if (teacherId.match(/^T\d{3}$/)) {
      return { success: true, message: 'Login successful' };
    } else {
      throw new Error('Invalid teacher ID format. Use format T followed by 3 digits (e.g., T001)');
    }
  },
  
  getTeacherAssignments: async (teacherId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const assignments = mockData.assignments[teacherId as keyof typeof mockData.assignments];
    if (!assignments) {
      throw new Error('No assignments found for this teacher');
    }
    return assignments;
  },
  
  getStudentsInClass: async (classId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const students = mockData.students[classId as keyof typeof mockData.students];
    if (!students) {
      throw new Error('No students found for this class');
    }
    return students;
  },
  
  getAttendanceSummary: async (classId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const summary = mockData.attendance_summary[classId as keyof typeof mockData.attendance_summary];
    if (!summary) {
      throw new Error('No attendance data found for this class');
    }
    return summary;
  },
  
  getStudentAttendance: async (rollNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const attendance = mockData.student_attendance[rollNumber as keyof typeof mockData.student_attendance];
    if (!attendance) {
      throw new Error('No attendance data found for this student');
    }
    return attendance;
  },
  
  getPreviousReports: async (rollNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const reports = mockData.previous_reports[rollNumber as keyof typeof mockData.previous_reports];
    if (!reports) {
      throw new Error('No previous reports found for this student');
    }
    return reports;
  },
  
  submitAttendance: async (classId: string, attendanceData: any[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful submission
    return { success: true, message: 'Attendance submitted successfully' };
  }
};

export default api;
