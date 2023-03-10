import { Registro } from './../services/avatar.service';
//import { FirestoreService } from './../services/firestore.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
import { Geolocation } from '@capacitor/geolocation';
import { ModalComponent } from '../modal/modal.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  profile = null;
  registros: Registro[] = [];
  registro:Registro
  credentials: FormGroup;
  longitud1:number;
  latitud1:number; 
  constructor(
    private fb: FormBuilder,
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalCtrl: ModalController


   

    //private firestore: FirestoreService
  ) {
    this.avatarService.getNotes().subscribe((data)=>{
      this.registros=data
      console.log(data)
    })
    // this.avatarService.getUserProfile().subscribe((data) => {
    //   this.profile = data;
    // });
  }
  
  // Easy access for form fields
  get name() {
    return this.credentials.get('name');
  }

  get lastname() {
    return this.credentials.get('lastname');
  }

  get idCard() {
    return this.credentials.get('idCard');
  }

  get schedule() {
    return this.credentials.get('schedule');
  }
  get latitud() {
    return this.latitud1;
  }
  get longitud() {
    return this.longitud1;
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      lastname: ['', [Validators.required, Validators.minLength(4)]],
      idCard: ['', [Validators.required, Validators.minLength(6)]],
      schedule: ['', [Validators.required, Validators.minLength(5)]],
      latitud: ['', [Validators.required, Validators.minLength(1)]],
      longitud: ['', [Validators.required, Validators.minLength(1)]],
    });
  }
  limpiarcampos=()=>{ 
    this.fb.group({
      name: new FormControl("")
      
    });
  }
  async deleteNote() {
    await this.avatarService.deleteNote(this.registro)
    this.modalCtrl.dismiss();
  }
 async openNote(registro: Registro) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { id: registro.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();
  }
 
  async addRegister() {
    
    console.log(this.credentials.value)

    this.avatarService.addRegister({
      name:this.credentials.get('name').value, 
      lastname:this.credentials.get('lastname').value, 
        idCard: this.credentials.get('idCard').value, 
        schedule:this.credentials.get('schedule').value,
        latitud:this.latitud1,
        longitud:this.longitud1,

        
    
    });
      this.credentials.reset()
    // this.limpiarcampos();
  }

  /*setCenso(){
    this.firestore.creatDoc;
  }*/



  obtenerCoordenadas=async() =>{
    const coordenadas= await Geolocation.getCurrentPosition();
    this.longitud1=coordenadas.coords.longitude;
    this.latitud1=coordenadas.coords.latitude;
   }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Carga fallida',
          message: 'Hubo un problema con la carga de tu imagen.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}