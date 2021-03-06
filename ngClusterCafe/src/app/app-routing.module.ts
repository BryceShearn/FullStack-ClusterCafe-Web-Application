import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MeetingListComponent } from './components/meeting-list/meeting-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { RegisterComponent } from './components/register/register.component';
import { UserLandingPageComponent } from './components/user-landing-page/user-landing-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'landingpage', component: UserLandingPageComponent},
  { path: 'posts', component: PostListComponent},
  { path: 'meetings', component: MeetingListComponent},
  { path: 'adminDashboard', component: AdminDashboardComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
