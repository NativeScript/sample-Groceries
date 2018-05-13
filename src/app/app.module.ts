import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http"
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { routes, navigatableComponents } from "./app.routing";
import { ActivityIndicator } from "./components/activity-indicator.component";
import { GroceryList } from "./pages/list/grocery-list.component";
import { ItemStatusPipe  } from "./pages/list/item-status.pipe";

@NgModule({
  declarations: [
    AppComponent,
    ...navigatableComponents,
    ActivityIndicator,
    GroceryList,
    ItemStatusPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
