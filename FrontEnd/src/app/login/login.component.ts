import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginService} from '../services/login.service';
import { MessageService } from "../services/message.service";

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: LoginService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // il bottone si può cliccare
    this.loading = true;

    this.accountService.login(this.f["username"].value, this.f["password"].value)
      .then(user => {
          if (user) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
            this.messageService.clear();
          } else {
            this.messageService.add("Credenziali errate");
            this.loading = false;
            this.form.reset();
            this.router.navigate(['/login']);
          }
        }
      );
  }
}
