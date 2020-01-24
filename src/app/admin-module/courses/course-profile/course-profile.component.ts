import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../_services/course/course.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from 'src/app/_services/user/user.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { EditScheduleComponent } from '../edit-schedule/edit-schedule.component';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { Course } from 'src/app/_services/course/course';

@Component({
  selector: 'app-course-profile',
  templateUrl: './course-profile.component.html',
  styleUrls: ['./course-profile.component.css']
})
export class CourseProfileComponent implements OnInit {
  course_id: any;
  course = new Course();

  constructor(
    private actRoute: ActivatedRoute,
    private courseApi: CourseService,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private userApi: UserService,
    private matDialog: MatDialog,
    private location: Location
  )
  {
    
    this.course_id = this.actRoute.snapshot.paramMap.get('id');

    // GETS THE COURSE DETAILS
    this.courseApi.GetCourse(this.course_id).subscribe(data => {
      this.course.details = data.details;
      this.course.instructors = data.instructors;
      this.course.max_students = data.max_students;
      this.course.name = data.name;
      this.course.schedule = data.schedule;
    });
    console.log(this.course);

  }

  ngOnInit() {

  }


  openEditScheduleModal(){
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.id = "edit-schedule-component";
    dialogConfig.height = "35%";
    dialogConfig.width = "40%";
    dialogConfig.data = {course_id: this.course_id};
    const modalDialog = this.matDialog.open(EditScheduleComponent, dialogConfig);
  }

  openEditCourseModal(){
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.id = "edit-course-component";
    dialogConfig.height = "46%";
    dialogConfig.width = "40%";
    dialogConfig.data = {course_id: this.course_id};
    const modalDialog = this.matDialog.open(EditCourseComponent, dialogConfig);
  }
  
}
