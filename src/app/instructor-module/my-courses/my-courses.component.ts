import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { UserService } from 'src/app/_services/user/user.service';
import { MatTableDataSource } from '@angular/material';
import { Course } from 'src/app/_services/course/course';
import { Schedule } from 'src/app/_services/schedule/schedule';


@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {

  displayedColumns: string[] = ['courseName','customColumn'];
  courseDataSource: MatTableDataSource<Schedule>;
  courses: any=[];
  user: any={};
  
  @Input() sessions:any =[];

  constructor(
    private _authService: AuthService,
    private userApi: UserService
    ) {
      this.user = this._authService.decode();
      this.userApi.GetInstructorCourseDetails(this.user).subscribe(data => {
        this.courses = data.courses;
        // console.log(data.courses)
        this.courseDataSource = new MatTableDataSource<Schedule>(this.courses);

      });
    }
  
  ngOnInit() {
  }

  //call to logout 
  logout() {
    this._authService.logout();
  }

 

}
