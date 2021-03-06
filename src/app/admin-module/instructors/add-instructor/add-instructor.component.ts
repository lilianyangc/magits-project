import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from '../../../_services/user/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.css']
})
export class AddInstructorComponent implements OnInit {
  InstructorForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private userApi: UserService,
    private ngZone: NgZone,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.instructorForm();
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.InstructorForm.controls[controlName].hasError(errorName);
  }

  // CREATES INSTRUCTOR ACCOUNT
  submitInstructorForm(){
    if(this.InstructorForm.valid){
      if(window.confirm('Are you sure you want to add this instructor?')){
        this.userApi.AddUser(this.InstructorForm.value).subscribe(res => {
          this.ngZone.run(() => this.router.navigateByUrl('/admin/instructors'))
        });
      }
    }
  }

  // INITIALIZES INSTRUCTOR FORM
  instructorForm(){
    this.InstructorForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['password'],
      role: ['instructor']
    });  
  }
  
  cancel(){
    this.location.back();
  }
}
