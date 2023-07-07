import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private storage: AngularFireStorage) {}


  /**
   * método para subir archivo
   * @param file 
   * @returns 
   */
  uploadFile(file: File): Observable<string | null> {
    const filePath = `files/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
  
    return from(uploadTask).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  }
  
/**
 * método para descargar el archivo
 * @param filePath 
 * @returns 
 */
  downloadFile(filePath: string): Observable<string | null> {
    const fileRef = this.storage.ref(filePath);

    return fileRef.getDownloadURL();
  }

  }

