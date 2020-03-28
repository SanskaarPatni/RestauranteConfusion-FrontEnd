import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedBack, ContactType } from '../shared/feedback';
import { flyInOut,expand } from '../animations/app.animations';
import { FeedbackService } from '../services/feedback.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})

export class ContactComponent implements OnInit {
  errMess: string;
  feedbackForm: FormGroup;
  feedback: FeedBack;
  contactType = ContactType;
  submitted = false;
  showForm = true;

  @ViewChild('fform') feedbackFormDirective;


  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be atleast two characters long',
      'maxlength': 'Last name must be atmost twenty five characters long'
    },
    'lastname': {
      'required': 'First name is required',
      'minlength': 'First name must be atleast two characters long',
      'maxlength': 'Last name must be atmost twenty five characters long'
    },
    'telnum': {
      'required': 'Telephone number is required',
      'pattern': 'Telephone number must contain only numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid format.'
    }
  };

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contactType: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();//re(set) form validations
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear previous error
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }

    }
  }
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.showForm = false;
    this.feedbackService.putFeedBack(this.feedback)
      .subscribe(feedback => {
        console.log(this.feedback);
        this.feedback = feedback;
        this.submitted = true;
        setTimeout(() => {
          this.submitted = false;
          this.feedback = null;
          this.showForm = true;
        }, 5000);
      }, errmess => {
        this.feedback = null;
        this.errMess = <any>errmess;
      });
    this.feedbackForm.reset(
      {
        firstname: '',
        lastname: '',
        telnum: 0,
        email: '',
        agree: false,
        contactType: 'None',
        message: ''
      }
    );
    this.feedbackFormDirective.resetForm();
  }

}
