import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signInWithOtp(email: string) {
    throw new Error('Method not implemented.')
  }
  private supabase: SupabaseClient
  private _currentUser: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null)

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Asenkron getUser işlemini düzgün bir şekilde ele al
    this.supabase.auth.getUser()
      .then(user => {
        this._currentUser.next(user ? user : false);
      })
      .catch(error => {
        console.error('Error fetching user', error);
        this._currentUser.next(false);
      });

      
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        this._currentUser.next(session!.user)
      } else {
        this._currentUser.next(false)
        this.router.navigateByUrl('/', { replaceUrl: true })
      }
    })
  }

  signInWithOTP(email: string) {
    // Note: This becomes signInWithOTP() in the next version!
    return this.supabase.auth.signInWithOtp({
      email,
    })
  }

  logout() {
    this.supabase.auth.signOut()
  }

  get currentUser() {
    return this._currentUser.asObservable()
  }
}
