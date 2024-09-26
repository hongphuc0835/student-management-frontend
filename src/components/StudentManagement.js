import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/StudentManagement.css";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male'); // Default gender
  const [major, setMajor] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingAge, setEditingAge] = useState('');
  const [editingGender, setEditingGender] = useState('Male'); // Default gender
  const [editingMajor, setEditingMajor] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  // URL API địa phương
  const API_URL = 'http://localhost:3000/students';

  const fetchStudents = () => {
    axios.get(API_URL)
      .then(response => {
        console.log(response.data); // Kiểm tra dữ liệu trả về
        setStudents(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy danh sách sinh viên:', error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    axios.post(API_URL, { name, age, gender, major })
      .then(response => {
        fetchStudents(); // Reload the student list
        setName('');
        setAge('');
        setGender('Male'); // Reset to default gender
        setMajor('');
      })
      .catch(error => console.error('Lỗi khi thêm sinh viên:', error));
  };

  const handleDeleteStudent = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        fetchStudents(); // Reload the student list
      })
      .catch(error => console.error('Lỗi khi xóa sinh viên:', error));
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);
    setEditingName(student.name);
    setEditingAge(student.age);
    setEditingGender(student.gender);
    setEditingMajor(student.major);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/${editingStudentId}`, {
      name: editingName,
      age: editingAge,
      gender: editingGender,
      major: editingMajor
    })
      .then(() => {
        fetchStudents(); // Reload the student list
        setEditingStudentId(null);
        setEditingName('');
        setEditingAge('');
        setEditingGender('Male'); // Reset to default gender
        setEditingMajor('');
      })
      .catch(error => console.error('Lỗi khi cập nhật sinh viên:', error));
  };

  // Hàm xử lý tìm kiếm theo ID
  const handleSearchById = () => {
    const student = students.find(student => student.id === searchId);
    if (student) {
      setFilteredStudents([student]);
    } else {
      setFilteredStudents([]);
      console.error('Không tìm thấy sinh viên với ID:', searchId);
    }
  };

  return (
    <div className="container">
      <h2>Quản lý sinh viên</h2>

      {/* Phần tìm kiếm sinh viên theo ID */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Tìm kiếm sinh viên theo ID" 
          value={searchId} 
          onChange={(e) => setSearchId(e.target.value)} 
        />
        <button onClick={handleSearchById}>Tìm kiếm</button>
      </div>

      {/* Form thêm sinh viên */}
      <form onSubmit={handleAddStudent} className="add-student-form">
        <input 
          type="text" 
          placeholder="Tên sinh viên" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Tuổi" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          required 
        />
        <select 
          value={gender} 
          onChange={(e) => setGender(e.target.value)} 
          required
        >
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
        <input 
          type="text" 
          placeholder="Chuyên ngành" 
          value={major} 
          onChange={(e) => setMajor(e.target.value)} 
          required 
        />
        <button type="submit">Thêm sinh viên</button>
      </form>

      {editingStudentId && (
        <form onSubmit={handleUpdateStudent} className="edit-student-form">
          <input 
            type="text" 
            placeholder="Tên sinh viên" 
            value={editingName} 
            onChange={(e) => setEditingName(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Tuổi" 
            value={editingAge} 
            onChange={(e) => setEditingAge(e.target.value)} 
            required 
          />
          <select 
            value={editingGender} 
            onChange={(e) => setEditingGender(e.target.value)} 
            required
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
          <input 
            type="text" 
            placeholder="Chuyên ngành" 
            value={editingMajor} 
            onChange={(e) => setEditingMajor(e.target.value)} 
            required 
          />
          <button type="submit">Cập nhật sinh viên</button>
        </form>
      )}

      {/* Container có thể cuộn cho bảng */}
      <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Tuổi</th>
              <th>Giới tính</th>
              <th>Chuyên ngành</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(filteredStudents.length > 0 ? filteredStudents : students).map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.major}</td>
                <td>
                  <button onClick={() => handleEditStudent(student)} className="btn btn-edit">Sửa</button>
                  <button onClick={() => handleDeleteStudent(student.id)} className="btn btn-delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
