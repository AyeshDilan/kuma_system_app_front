import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user = {
    firstName: '',
    lastName: '',
    position: '',
    nicNumber: '',
    email: '',
    password: '',
    contact: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  handleClick(form: any) {
    if (form.invalid) {
      alert("Please add all required information.");
      return;
    }

    this.http.post("http://localhost:8081/user", this.user, {
      headers: { "Content-Type": "application/json" }
    })
    .subscribe(
      response => {
        alert(`${this.user.firstName} ${this.user.lastName} is registered successfully.`);
        form.resetForm();  // Reset the form
        this.router.navigate(['/login']);  // Redirect to login page
      },
      error => {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
      }
    );
  }
}
