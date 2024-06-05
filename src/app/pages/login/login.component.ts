import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { HttpClient } from '@angular/common/http';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  http;
  isInMail: boolean = false;
  isPassword: boolean = false;
  inListMail: any;

  login = {
    email: '',
    password: null
  }

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  onLogin() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "JSESSIONID=7BA164369DB217CF246E00268EF0BC1C");

    const raw = JSON.stringify({
      "id": "01",
      "firstName": "",
      "lastName": "",
      "position": "",
      "nicNumber": "",
      "email": this.login.email,
      "password": this.login.password,
      "contact": ""
    });

    fetch("http://localhost:8081/user/authenticateUser", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    })
      .then(async (response) => {
        if (!response.ok) {
          alert("User not registered or another error occurred. Refreshing the page.");
          this.login.email = '';
          this.login.password = null;
          return;
        }
        const responseText = await response.text();
        console.log("Response Text:", responseText); // Log the response text
        if (responseText === "true") {
          // User authenticated successfully, redirect to home/invoice page
          window.location.href = "http://localhost:4200/home/invoice";
        } else {
          // Error, invalid password
          alert("Invalid password. Please try again.");
          this.login.password = null;
        }
      })
      .catch((error) => console.error('Error:', error));
  }
}
