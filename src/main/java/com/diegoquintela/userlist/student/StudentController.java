package com.diegoquintela.userlist.student;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/students")
@AllArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
//        throw new IllegalStateException("error");

        return studentService.getAllStudents();
    }

    @PostMapping //exposing to restful api for post requests
    //@Valid adds validation to the form via javax.validation
    public void addStudent(@Valid @RequestBody Student student) {
        studentService.addStudent(student);
    }

    @DeleteMapping(path = "{studentId}") // method has a path and receives studentId
    //method receives the path and map to the variable studentId
    public void deleteStudent(@PathVariable("studentId") Long studentId) {
        studentService.deleteStudent(studentId); //then it calls the deleteStudent method at the Student Service
    }
}
