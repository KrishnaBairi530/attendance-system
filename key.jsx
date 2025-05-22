import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AttendanceMarking() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [date]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/students', {
        params: { date: date.toISOString().split('T')[0] }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const submitAttendance = async () => {
    try {
      await axios.post('/api/attendance', {
        date: date.toISOString().split('T')[0],
        records: students
      });
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
      <div className="mb-4">
        <label className="block mb-2">Select Date:</label>
        <DatePicker
          selected={date}
          onChange={date => setDate(date)}
          className="border p-2 rounded"
        />
      </div>
      
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Student Name</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="py-2 px-4 border">{student.full_name}</td>
                  <td className="py-2 px-4 border">
                    <select
                      value={student.status || 'present'}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button
        onClick={submitAttendance}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        disabled={loading}
      >
        Submit Attendance
      </button>
    </div>
  );
}

export default AttendanceMarking;