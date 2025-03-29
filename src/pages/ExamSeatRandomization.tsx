
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shuffle, Download, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

const ExamSeatRandomization = () => {
  const { toast } = useToast();
  const [examName, setExamName] = useState('');
  const [classSize, setClassSize] = useState('');
  const [randomizedSeats, setRandomizedSeats] = useState<Student[]>([]);
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);

  // This would fetch from API in a real implementation
  const generateMockStudents = (size: number): Student[] => {
    return Array.from({ length: size }, (_, i) => ({
      id: `student-${i + 1}`,
      name: `Student ${i + 1}`,
      rollNumber: `ROLL${1000 + i}`,
    }));
  };

  const handleRandomize = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        if (!classId || !examName || !classSize || parseInt(classSize) <= 0) {
          toast({
            title: "Missing Information",
            description: "Please fill all required fields with valid values",
            variant: "destructive"
          });
          return;
        }
        
        const size = parseInt(classSize);
        const students = generateMockStudents(size);
        
        // Randomize the array using Fisher-Yates algorithm
        for (let i = students.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [students[i], students[j]] = [students[j], students[i]];
        }
        
        setRandomizedSeats(students);
        
        toast({
          title: "Randomization Completed",
          description: `Successfully randomized seats for ${size} students`,
        });
      } catch (error) {
        toast({
          title: "Randomization Failed",
          description: "An error occurred while randomizing seats",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleDownload = () => {
    try {
      // Create CSV content
      let csvContent = "Seat No,Roll Number,Student Name\n";
      randomizedSeats.forEach((student, index) => {
        csvContent += `${index + 1},${student.rollNumber},${student.name}\n`;
      });
      
      // Create a blob and download it
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${examName.replace(/\s+/g, '_')}_seating_plan.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your seating plan has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the seating plan",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exam Seat Randomization</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Seating Plan</CardTitle>
          <CardDescription>
            Randomize student seating for exams to prevent cheating and encourage fair assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Class/Course</Label>
              <Input 
                id="classId" 
                placeholder="Enter class ID or name" 
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name</Label>
              <Input 
                id="examName" 
                placeholder="Midterm, Final, etc." 
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classSize">Number of Students</Label>
              <Input 
                id="classSize" 
                type="number" 
                placeholder="Enter number of students" 
                value={classSize}
                onChange={(e) => setClassSize(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button onClick={handleRandomize} disabled={loading || !classId || !examName || !classSize}>
            <Shuffle className="mr-2 h-4 w-4" />
            {loading ? "Randomizing..." : "Randomize Seats"}
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownload}
            disabled={randomizedSeats.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Seating Plan
          </Button>
        </CardFooter>
      </Card>

      {randomizedSeats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Randomized Seating Plan</CardTitle>
            <CardDescription>
              {examName} - Total Students: {randomizedSeats.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Seat No.</th>
                      <th className="px-4 py-3 text-left font-medium">Roll Number</th>
                      <th className="px-4 py-3 text-left font-medium">Student Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {randomizedSeats.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{student.rollNumber}</td>
                        <td className="px-4 py-2">{student.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExamSeatRandomization;
