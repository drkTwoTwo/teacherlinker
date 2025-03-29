
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockApi } from '@/services/api';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

interface AttendanceRecord {
  course_id: string;
  course_name: string;
  attendance_percent: number;
  total_classes: number;
  attended_classes: number;
}

const AttendanceReports = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      toast.error('Please enter a roll number');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getStudentAttendance(rollNumber);
      setAttendanceData(data);
      // Mock student name since the API doesn't return it
      if (rollNumber === 'CSE2023003') {
        setStudentName('Carlos Rodriguez');
      } else if (rollNumber === 'CSE2022003') {
        setStudentName('Hannah Kim');
      } else {
        // If we have data but no predefined name
        setStudentName('Student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      setAttendanceData(null);
      setStudentName(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall attendance percentage
  const calculateOverallAttendance = () => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    
    const totalClasses = attendanceData.reduce((sum, record) => sum + record.total_classes, 0);
    const attendedClasses = attendanceData.reduce((sum, record) => sum + record.attended_classes, 0);
    
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  };

  const overallAttendance = attendanceData ? calculateOverallAttendance() : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
        <p className="text-muted-foreground">
          View detailed attendance records for students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Lookup</CardTitle>
          <CardDescription>Enter a student's roll number to view their attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Roll Number (e.g., CSE2023003)"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {attendanceData && studentName && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{studentName}</CardTitle>
              <CardDescription>Roll Number: {rollNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Overall Attendance</h3>
                  <ProgressBar 
                    value={overallAttendance} 
                    max={100} 
                    colorThreshold={{ warning: 75, danger: 50 }}
                    size="lg"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Course-wise Attendance</h3>
                  <div className="space-y-6">
                    {attendanceData.map((record) => (
                      <div key={record.course_id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{record.course_name}</h4>
                            <p className="text-sm text-muted-foreground">{record.course_id}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.attendance_percent < 50 
                              ? 'bg-rose-100 text-rose-800' 
                              : record.attendance_percent < 75 
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {record.attendance_percent}%
                          </div>
                        </div>
                        <ProgressBar 
                          value={record.attendance_percent} 
                          max={100}
                          colorThreshold={{ warning: 75, danger: 50 }}
                        />
                        <p className="text-sm text-muted-foreground">
                          Classes Attended: {record.attended_classes} / {record.total_classes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {attendanceData.some(record => record.attendance_percent < 75) && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-amber-800 mb-2">Attendance Warning</h3>
                <p className="text-amber-700">
                  This student has below 75% attendance in one or more courses and may be at risk of 
                  being marked as Non-Collegiate (NC).
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      <div className="text-sm text-muted-foreground text-center">
        <p>For demo purposes, try roll numbers: CSE2023003 or CSE2022003</p>
      </div>
    </div>
  );
};

export default AttendanceReports;
