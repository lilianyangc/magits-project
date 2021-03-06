import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import { Course } from 'src/app/_services/course/course';
import { CourseService } from 'src/app/_services/course/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  user: any;
  CourseData: any;
  dataSource: MatTableDataSource<Course>;
  displayedColumns: string[] = ['name', 'instructors', 'members', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

   //LOADING
   isLoading: boolean = false;
   noCourses: boolean = false; 
 

  constructor
    (
      private courseApi: CourseService,
      private router: Router
    ) {
    this.isLoading = true;	
    let CourseData = [];

    this.courseApi.GetCourses().subscribe(data => {
      for (const i in data) {
        CourseData.push(data[i]);
      }

      // converts the array of instructor id into their actual name
      for (var i = 0; i < CourseData.length; i++) {
        let temp = [];
        this.courseApi.GetCourseInstructors(data[i]._id).subscribe(data => {
          for (const i in data) {
            temp.push(`${data[i].firstname} ${data[i].lastname}`);
          }
        });
        CourseData[i].instructors = temp
      }

      this.dataSource = new MatTableDataSource<Course>(CourseData);
      this.dataSource.paginator = this.paginator;

      if(this.dataSource.data.length > 0){
        this.isLoading = false;
      }else if(this.dataSource.data.length  == 0){
        this.isLoading = false;
        this.noCourses = true;
      }

    });

  }

  ngOnInit() {
  }

  viewInfo(element) {
    this.router.navigate(['/admin/course-profile/', element._id])
  }

  deleteCourse(element) {
    if (window.confirm('Are you sure you want to delete this course?')) {
      this.courseApi.DeleteCourse(element._id).subscribe();
      window.location.reload();
    }
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
 
}
