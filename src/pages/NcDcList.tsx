
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '@/components/ui/DataTable';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Assignment {
  course_id: string;
  course_name: string;
  class_id: string;
  semester: number;
  total_students: number;
}

interface AttendanceRecord {
  roll_number: string;
  name: string;
  attendance_percent: number;
  total_classes: number;
  attended_classes: number;
}

const NcDcList = () => {
  const { teacher } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch teacher assignments
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

  // Fetch attendance summary for selected class
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      if (selectedClass) {
        setLoading(true);
        try {
          const data = await mockApi.getAttendanceSummary(selectedClass);
          setAttendanceData(data);
        } catch (error) {
          toast.error('Failed to fetch attendance data');
          setAttendanceData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectedClass) {
      fetchAttendanceSummary();
    }
  }, [selectedClass]);

  // Filter for NC and DC students
  const ncStudents = attendanceData.filter(
    student => student.attendance_percent < 75 && student.attendance_percent >= 50
  );
  
  const dcStudents = attendanceData.filter(
    student => student.attendance_percent < 50
  );

  const columns = [
    {
      key: 'roll_number',
      header: 'Roll Number',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
    },
    {
      key: 'attendance_percent',
      header: 'Attendance',
      sortable: true,
      render: (value: number, row: AttendanceRecord) => (
        <div className="w-48">
          <ProgressBar 
            value={value} 
            max={100} 
            colorThreshold={{ warning: 75, danger: 50 }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: 'attended_classes',
      header: 'Classes Attended',
      sortable: true,
      render: (value: number, row: AttendanceRecord) => (
        <span>{value} / {row.total_classes}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: any, row: AttendanceRecord) => (
        <span 
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.attendance_percent < 50 
              ? 'bg-rose-100 text-rose-800' 
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.attendance_percent < 50 ? 'DC' : 'NC'}
        </span>
      ),
    },
  ];

  const getCourseNameForClass = (classId: string) => {
    const assignment = assignments.find(a => a.class_id === classId);
    return assignment ? assignment.course_name : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NC-DC List</h1>
        <p className="text-muted-foreground">
          View and export students with attendance below requirements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate List</CardTitle>
          <CardDescription>
            Select a class to view Non-Collegiate (NC) and Dis-Collegiate (DC) students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="class-select" className="text-sm font-medium">
                Class
              </label>
              <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value)}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem key={assignment.class_id} value={assignment.class_id}>
                      {assignment.class_id} - {assignment.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-700">Non-Collegiate (NC) Students</CardTitle>
                <CardDescription>
                  Students with attendance below 75% but at or above 50%
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : ncStudents.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={ncStudents} 
                    exportable={true}
                    exportFileName={`NC-List-${selectedClass}`}
                  />
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No NC students found in this class
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-rose-700">Dis-Collegiate (DC) Students</CardTitle>
                <CardDescription>
                  Students with attendance below 50%
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : dcStudents.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={dcStudents}
                    exportable={true} 
                    exportFileName={`DC-List-${selectedClass}`}
                  />
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No DC students found in this class
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary - {selectedClass}</CardTitle>
              <CardDescription>
                {getCourseNameForClass(selectedClass)} - Total Students: {attendanceData.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md">
                      <span className="font-medium">Good: </span>
                      {attendanceData.filter(s => s.attendance_percent >= 75).length} students
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-md">
                      <span className="font-medium">NC: </span>
                      {ncStudents.length} students
                    </div>
                    <div className="bg-rose-100 text-rose-800 px-3 py-2 rounded-md">
                      <span className="font-medium">DC: </span>
                      {dcStudents.length} students
                    </div>
                  </div>
                  
                  <DataTable 
                    columns={columns} 
                    data={attendanceData} 
                    exportable={true}
                    exportFileName={`Attendance-${selectedClass}`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NcDcList;
