import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss']
})
export class AddPartyComponent {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  image: File | null = null;
  formData = new FormData();

  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private apiService: ApiService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      mobile_no: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      telephone_no: ['', Validators.pattern('^[0-9]{10}$')],
      whatsapp_no: ['', Validators.pattern('^[0-9]{10}$')],
      email: ['', [Validators.required, Validators.email]],
      remark: [''],
      login_access: [false],
      date_of_birth: ['', Validators.required],
      anniversary_date: ['', Validators.required],
      gstin: ['', Validators.required],
      pan_no: ['', Validators.required],
      apply_tds: [false],
      credit_limit: ['', Validators.required],
      address: this.fb.array([]),
      bank: this.fb.array([])
    });
   }

  ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.title = 'Add User';
      if (this.id) {
          // edit mode
          this.title = 'Edit User';
          this.loading = true;
          this.apiService.getById(this.id)
              .pipe(first())
              .subscribe(x => {
                for (let i = 0; i < x.address.length-1; i++) {
                  this.addAddress();
                }
                for (let i = 0; i < x.bank_id.length-1; i++) {
                  this.addBank();
                }
                this.form.patchValue(x);
                this.form.patchValue({bank:x.bank_id});
                this.loading = false;
              });
      }
    this.addAddress();
    this.addBank();
  }

  get f() { return this.form.controls; }
   get addressControls() {
    return (this.form.get('address') as FormArray).controls;
  }

  get bankControls() {
    return (this.form.get('bank') as FormArray).controls;
  }

  getAddressControls(itemIndex: number) {
    return (this.addressControls.at(itemIndex) as FormGroup).controls;
  }
  geBankControl(itemIndex: number) {
    return (this.bankControls.at(itemIndex) as FormGroup).controls;
  }

  addAddress(): void {
    (this.form.get('address') as FormArray).push(this.fb.group({
      id: [''],
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required]
    }));
  }

  removeAddress(index: number): void {
    (this.form.get('address') as FormArray).removeAt(index);
  }

  addBank(): void {
    (this.form.get('bank') as FormArray).push(this.fb.group({
      id: [''],
      bank_ifsc_code: ['', Validators.required],
      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      account_no: ['', Validators.required],
      account_holder_name: ['', Validators.required]
    }));
  }

  removeBank(index: number): void {
    (this.form.get('bank') as FormArray).removeAt(index);
  }


  onFileChange(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      this.image = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
      this.submitted = true;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
          return;
      }


      Object.keys(this.form.controls).forEach(key => {
        if (key === 'address' || key === 'bank') {          
            this.formData.append(key, JSON.stringify(this.form.get(key)?.value));
        }
        else{
          this.formData.append(key, this.form.get(key)?.value);
        }
      });
      if (this.image) {
        this.formData.append('image', this.image);
      }

      this.submitting = true;
      this.saveParty()
          .pipe(first())
          .subscribe({
              next: (response:any) => {
                if(response.success)
                  this.router.navigateByUrl('/dashboard');
                else{
                  alert(response.msg)
                }
              },
              error: (error:Error) => {
                  alert(error.message);
                  this.submitting = false;
              }
          })
  }

  private saveParty() {
      return this.id
          ? this.apiService.update(this.id!, this.formData)
          : this.apiService.add(this.formData);
  }
}