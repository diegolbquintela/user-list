package com.diegoquintela.userlist.student;

import com.diegoquintela.userlist.student.exception.BadRequestException;
import com.diegoquintela.userlist.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service //for dependency injection
public class StudentService {
//business logic

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // add new students to the list
    public void addStudent(Student student) {
        Boolean existsEmail = studentRepository
                .selectExistsEmail(student.getEmail());
        if(existsEmail) {
            throw new BadRequestException(
                    "E-mail " + student.getEmail() + " taken");
        }

        studentRepository.save(student);

    }

    public void deleteStudent(Long studentId) {
        if(!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException(
                    "User with id " + studentId + "does not exist"
            );
        }
        studentRepository.deleteById(studentId);
    }
}
