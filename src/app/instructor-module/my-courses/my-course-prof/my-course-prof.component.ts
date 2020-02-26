import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../_services/course/course.service';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { Location } from '@angular/common';
import { SessionService } from 'src/app/_services/session/session.service';
import { Session } from 'src/app/_services/session/session';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver  } from '@angular/flex-layout';
import { User } from 'src/app/_services/user/user';

@Component({
  selector: 'app-my-course-prof',
  templateUrl: './my-course-prof.component.html',
  styleUrls: ['./my-course-prof.component.css']
})
export class MyCourseProfComponent implements OnInit {
// WATCHER
  myNumberQRVersion = 9;
  watcher: Subscription;
  columns: number = 4;

//MEMBER TABLE
  members: any = [];
  memberDataSource: MatTableDataSource<User>;
  memberDisplayedColumns: string[] = ['name'];
  @ViewChild('memberPaginator', {static: true}) memberPaginator: MatPaginator;
  

//SESSION TABLE  
  sessions: any = [];
  sessionDataSource: MatTableDataSource<Session>;
  displayedColumns: string[] = ['date','day','time','attendees','feedback'];
  // @ViewChild(MatPaginator, {static: true}) sessionPaginator: MatPaginator;
  @ViewChild('sessionPaginator', {static: true}) sessionPaginator: MatPaginator;

  course_id: any;
  course : any = {};
  instructors = [];
  courseForSession: any ={};

  //LOADING
  isLoading: boolean = true;
  noMembers: boolean = false;

  constructor(
    private actRoute: ActivatedRoute,
    private courseApi: CourseService,
    private sessionApi: SessionService,
    private router: Router,
    private location: Location,
    media: MediaObserver,
  )
  {
    this.course_id = this.actRoute.snapshot.paramMap.get('id');

    // GETS ALL COURSE INSTRUCTORS
    this.courseApi.GetCourseInstructors(this.course_id).subscribe(data => {
      for (const i in data) {
        this.instructors.push(
          {name: data[i].firstname + " " + data[i].lastname, id: data[i]._id});
      }
    });

    // GETS THE COURSE DETAILS
    this.courseApi.GetCourse(this.course_id).subscribe(data => {
      this.course = data;
      this.getSessions(this.course);
    });

    //GETS MEMBERS OF THIS COURSE
    this.courseApi.GetMembersEnrolled(this.course_id).subscribe(data => {
      this.members = data;
      this.memberDataSource = new MatTableDataSource<User>(this.members);
      if(this.members.length > 0){
        this.isLoading = false;
      }else if(this.members.length == 0){
        this.isLoading = false;
        this.noMembers = true;
      }
      this.memberDataSource.paginator = this.memberPaginator;
    });

    //WATCHER
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change) {
        if (change.mqAlias == 'xs') {
          this.columns = 1;
          this.myNumberQRVersion = 4;
        } else if( change.mqAlias == 'sm'){
          this.myNumberQRVersion = 8;
        } else if( change.mqAlias == 'md'){
          this.myNumberQRVersion = 9;
        } else {
          this.columns = 2;
          this.myNumberQRVersion = 11;
        }
      }
    });
    
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  back(){
    this.location.back();
  }

  getSessions(course: any){
    // GETS SESSIONS OF THIS COURSE
    this.sessionApi.GetSessionsByCourse(this.course).subscribe(data =>{
    this.sessions = data;
    this.sessionDataSource = new MatTableDataSource<Session>(this.sessions);
    this.sessionDataSource.paginator = this.sessionPaginator;
    });
  }

  viewSession(session: any){
    this.router.navigate(['/instructor/sess-info/', session._id]);
  }
}
