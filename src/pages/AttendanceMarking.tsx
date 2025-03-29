
import React, { useState, useEffect } from 'react';
import { mockApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Assignment {
  course_id: string;
  course_name: string;
  class_id: string;
  semester: number;
  total_students: number;
}

interface Student {
  roll_number: string;
  name: string;
  email: string;
}

interface AttendanceData {
  roll_number: string;
  name: string;
  present: boolean;
}

const AttendanceMarking = () => {
  const { teacher } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Initialize today's date in YYYY-MM-DD format
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  // Fetch teacher's assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (teacher?.teacher_id) {
        setLoading(true);
        try {
          const data = await mockApi.getTeacherAssignments(teacher.teacher_id);
          setAssignments(data);
        } catch (error) {
          toast.error('Failed to fetch assignments');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignments();
  }, [teacher]);

  // Fetch students for selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass) {
        setLoading(true);
        try {
          const data = await mockApi.getStudentsInClass(selectedClass);
          setStudents(data);
          
          // Initialize attendance data with all students marked present
          const initialAttendance = data.map(student => ({
            roll_number: student.roll_number,
            name: student.name,
            present: true
          }));
          setAttendance(initialAttendance);
        } catch (error) {
          toast.error('Failed to fetch students');
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const toggleAttendance = (rollNumber: string) => {
    setAttendance(prev =>
      prev.map(item =>
        item.roll_number === rollNumber
          ? { ...item, present: !item.present }
          : item
      )
    );
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    // Find the corresponding course
    const assignment = assignments.find(a => a.class_id === value);
    if (assignment) {
      setSelectedCourse(assignment.course_name);
    }
  };

  const markAllPresent = () => {
    setAttendance(prev =>
      prev.map(item => ({ ...item, present: true }))
    );
    toast.success('All students marked present');
  };

  const markAllAbsent = () => {
    setAttendance(prev =>
      prev.map(item => ({ ...item, present: false }))
    );
    toast.success('All students marked absent');
  };

  const submitAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select class and date');
      return;
    }

    setSubmitting(true);
    try {
      // Format attendance data for submission
      const attendanceData = attendance.map(item => ({
        roll_number: item.roll_number,
        present: item.present,
        class_id: selectedClass,
        course_id: assignments.find(a => a.class_id === selectedClass)?.course_id,
        date: selectedDate
      }));

      await mockApi.submitAttendance(selectedClass, attendanceData);
      toast.success('Attendance submitted successfully');
    } catch (error) {
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Marking</h1>
        <p className="text-muted-foreground">
          Record daily attendance for your classes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class & Date</CardTitle>
          <CardDescription>Choose the class and date for attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="class-select" className="text-sm font-medium">
                Class
              </label>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem
                      key={assignment.class_id}
                      value={assignment.class_id}
                    >
                      {assignment.class_id} - {assignment.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date-select" className="text-sm font-medium">
                Date
              </label>
              <input
                type="date"
                id="date-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedCourse}</CardTitle>
                <CardDescription>{selectedClass} - {students.length} students</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllPresent}>
                  All Present
                </Button>
                <Button variant="outline" size="sm" onClick={markAllAbsent}>
                  All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.map((student) => (
                <div
                  key={student.roll_number}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.roll_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={student.present ? 'text-green-600' : 'text-red-600'}>
                      {student.present ? 'Present' : 'Absent'}
                    </span>
                    <Switch
                      checked={student.present}
                      onCheckedChange={() => toggleAttendance(student.roll_number)}
                    />
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-4" 
                onClick={submitAttendance} 
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Submitting...
                  </div>
                ) : (
                  'Submit Attendance'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceMarking;
