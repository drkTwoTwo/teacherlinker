
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApi } from '@/services/api';
import { toast } from 'sonner';
import { Search, BookOpen, AlertTriangle } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Subject {
  code: string;
  name: string;
  grade: string;
  credits: number;
  status: string;
}

interface SemesterResult {
  semester: number;
  sgpa: number;
  subjects: Subject[];
}

interface BacklogSubject {
  code: string;
  name: string;
  semester: number;
  credits: number;
}

interface SemesterCGPA {
  semester: number;
  cgpa: number;
}

interface StudentReport {
  student_name: string;
  current_semester: number;
  cgpa: number;
  semester_results: SemesterResult[];
  backlog_subjects: BacklogSubject[];
  semester_wise_cgpa: SemesterCGPA[];
}

const GradeColor = {
  'A+': 'text-emerald-600',
  'A': 'text-emerald-600',
  'B+': 'text-green-600',
  'B': 'text-green-600',
  'C+': 'text-blue-600',
  'C': 'text-blue-600',
  'D': 'text-amber-600',
  'F': 'text-rose-600',
};

const PreviousSemesterReports = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<StudentReport | null>(null);
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
      const data = await mockApi.getPreviousReports(rollNumber);
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report data');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColorClass = (grade: string) => {
    return GradeColor[grade as keyof typeof GradeColor] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Previous Semester Reports</h1>
        <p className="text-muted-foreground">
          View student performance across past semesters
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Lookup</CardTitle>
          <CardDescription>Enter a student's roll number to view their reports</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Roll Number (e.g., CSE2022003)"
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

      {reportData && (
        <>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{reportData.student_name}</CardTitle>
                  <CardDescription>Roll Number: {rollNumber}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Current Semester</div>
                  <div className="text-xl font-bold">{reportData.current_semester}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Overall CGPA</div>
                  <div className="text-3xl font-bold mt-1">{reportData.cgpa.toFixed(1)}</div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Last Semester SGPA</div>
                  <div className="text-3xl font-bold mt-1">
                    {reportData.semester_results[0]?.sgpa.toFixed(1) || 'N/A'}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Backlog Subjects</div>
                  <div className="text-3xl font-bold mt-1">
                    {reportData.backlog_subjects.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>CGPA progression across semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reportData.semester_wise_cgpa.sort((a, b) => a.semester - b.semester)}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="semester" 
                      label={{ value: 'Semester', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      label={{ value: 'CGPA', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cgpa" 
                      name="CGPA" 
                      stroke="#4f46e5" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="semesterResults">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="semesterResults">
                <BookOpen className="mr-2 h-4 w-4" />
                Semester Results
              </TabsTrigger>
              <TabsTrigger value="backlogs">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Backlog Subjects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="semesterResults">
              {reportData.semester_results.map((result) => (
                <Card key={result.semester} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Semester {result.semester}</CardTitle>
                        <CardDescription>Course Results</CardDescription>
                      </div>
                      <div className="px-3 py-1 bg-primary/10 rounded-full">
                        <span className="font-medium">SGPA: {result.sgpa.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-2 font-medium text-muted-foreground">Code</th>
                            <th className="pb-2 font-medium text-muted-foreground">Subject</th>
                            <th className="pb-2 font-medium text-muted-foreground">Credits</th>
                            <th className="pb-2 font-medium text-muted-foreground">Grade</th>
                            <th className="pb-2 font-medium text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.subjects.map((subject) => (
                            <tr key={subject.code} className="border-b hover:bg-muted/20 transition-colors">
                              <td className="py-3">{subject.code}</td>
                              <td className="py-3">{subject.name}</td>
                              <td className="py-3">{subject.credits}</td>
                              <td className={`py-3 font-medium ${getGradeColorClass(subject.grade)}`}>
                                {subject.grade}
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  subject.status === 'Pass' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {subject.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="backlogs">
              <Card>
                <CardHeader>
                  <CardTitle>Backlog Subjects</CardTitle>
                  <CardDescription>
                    Subjects that need to be cleared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData.backlog_subjects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-2 font-medium text-muted-foreground">Code</th>
                            <th className="pb-2 font-medium text-muted-foreground">Subject</th>
                            <th className="pb-2 font-medium text-muted-foreground">Semester</th>
                            <th className="pb-2 font-medium text-muted-foreground">Credits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.backlog_subjects.map((subject) => (
                            <tr key={subject.code} className="border-b hover:bg-muted/20 transition-colors">
                              <td className="py-3">{subject.code}</td>
                              <td className="py-3">{subject.name}</td>
                              <td className="py-3">{subject.semester}</td>
                              <td className="py-3">{subject.credits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No backlog subjects found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <div className="text-sm text-muted-foreground text-center">
        <p>For demo purposes, try roll number: CSE2022003</p>
      </div>
    </div>
  );
};

export default PreviousSemesterReports;
