import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private location: Location ) { }
  

  isActive(urls: string[]): boolean {
    const currentPath = this.location.path();
    return urls.some(url => {
      if (url.includes('{$id}')) {
        const pattern = url.replace('{$id}', '\\d+');
        return new RegExp(`^${pattern}$`).test(currentPath);
      }
      return currentPath === url;
    });
  }

}
