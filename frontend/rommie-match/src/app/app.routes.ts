import { Routes } from '@angular/router';
import LoginPage from './auth/login.page';
import RegisterPage from './auth/register.page';

import BaseLayoutComponent from './shared/base-layout.component';

import StudentHomePage from './students/student-home.page';
import StudentsBrowsePage from './students/students-browse.page';
import StudentListingsPage from './students/student-listings.page';
import StudentMePage from './students/student-me.page';
import StudentMessagesPage from './students/student-messages.page';
import StudentMessageComposePage from './students/student-message-compose.page';

import LandlordHomePage from './landlords/landlord-home.page';
import LandlordMyListingsPage from './landlords/landlord-my-listings.page';
import LandlordListingFormPage from './landlords/landlord-listing-form.page';
import LandlordProfilePage from './landlords/landlord-profile.page';
import LandlordMessagesPage from './landlords/landlord-messages.page';
import LandlordMessageComposePage from './landlords/landlord-message-compose.page';

import AdminHomePage from './admin/admin-home.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'students',
        component: StudentHomePage,
        children: [
          { path: 'browse', component: StudentsBrowsePage },
          { path: 'listings', component: StudentListingsPage },
          { path: 'me', component: StudentMePage },
          { path: 'messages', component: StudentMessagesPage },                     // inbox
          { path: 'messages/compose/:recipientId', component: StudentMessageComposePage }, // redactar
          { path: '', redirectTo: 'browse', pathMatch: 'full' },
        ],
      },

      {
        path: 'landlords',
        component: LandlordHomePage,
        children: [
          { path: 'my-listings', component: LandlordMyListingsPage },
          { path: 'new', component: LandlordListingFormPage },
          { path: 'edit/:id', component: LandlordListingFormPage },
          { path: 'profile', component: LandlordProfilePage },
          { path: 'messages', component: LandlordMessagesPage },
          { path: 'messages/compose/:recipientId', component: LandlordMessageComposePage },
          { path: '', redirectTo: 'my-listings', pathMatch: 'full' },
        ],
      },


      { path: 'admin', component: AdminHomePage },
      { path: '', redirectTo: 'students', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
