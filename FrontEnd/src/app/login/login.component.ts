import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {LoginService} from '../services/login.service';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService
    ) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get f() {
        return this.form.controls;
    }

    async onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.loginService.login(this.f["username"].value, this.f["password"].value)
            .then(user => {
                    if (user.customer_id! > 0) {
                        //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
                        //this.router.navigateByUrl(returnUrl);
                        console.log("login, OK")
                        this.router.navigate(['/home']);
                    } else {
                        console.log("login, NOT OK")
                        this.loading = false;
                        this.form.reset();
                        this.router.navigate(['/login']);
                    }
                }
            );
    }

    /** Per creare password, usare questo per il futuro
     creaHash() {
    genSalt(10).then((salt) => hash("pass", salt)).then((hash) => {
      console.log("pass");
      console.log(hash);
      const hashed = hash;
      compare("pass", hashed).then((result) => {
        console.log(true)
      });
      compare("not_bacon", hashed).then((result) => {
        console.log(false)
      });
    });
  }
     **/
}
