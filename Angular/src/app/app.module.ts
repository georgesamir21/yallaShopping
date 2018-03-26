import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Http} from '@angular/http';

import { AppComponent } from './app.component';
// import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';

import { AuthComponent } from './auth/auth.component';

import { HeaderModule} from './header/index';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angular5-social-login";

import { AuthServiceService } from './auth-service.service';


export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("566145113759448")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("521472444901-f0ijnmhagvoa5e5st8hm4q1orksj4v9j.apps.googleusercontent.com")
        },
      ])
  return config;
}
import { SubCategoryProductsComponent } from './sub-category-products/sub-category-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LimitToPipe } from  './limit-to.pipe';

import { CategoryService } from './services/category.service';
const appRoutes: Routes = [
  { path: '', component: BodyComponent },
  { path: 'category/:subcategory', component: SubCategoryProductsComponent },
  { path: '**', component: BodyComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    // HeaderComponent,
    FooterComponent,
    BodyComponent,
    AuthComponent,
    SubCategoryProductsComponent,
    ProductDetailsComponent,
    LimitToPipe
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    HttpClientModule,
    // SubCategoryProductsComponent,
    // ProductDetailsComponent,
    // AddProductComponent,
    // LimitToPipe,
    BrowserModule,
    HeaderModule,
    RouterModule.forRoot(appRoutes)
    ],
  providers: [CategoryService, {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    },
    AuthServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
