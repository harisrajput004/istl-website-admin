import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/crud/home/home.service';
import { Router, RouterLink } from '@angular/router';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-team',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  faTrashCan = faTrashCan;
  team: any[] = [];
  canDelete = false;

  constructor(private homeService: HomeService, private permissionService: PermissionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTeamMembers();
    this.checkDeletePermission();
  }

  checkDeletePermission(): void {
    this.permissionService.hasPermission$('Team', 'delete').subscribe({
      next: (hasPermission) => {
        this.canDelete = hasPermission;
      },
      error: (err) => {
        console.error('Error checking delete permission:', err);
        this.canDelete = false;
      }
    });
  }

  getAllTeamMembers(): void {
    this.homeService.getAllTeamMembers().subscribe({
      next: (response) => {
        this.team = response;
      },
      error: (err) => {
        console.error('Error fetching team:', err);
      }
    });
  }
  deleteTeamMember(id: number): void {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.homeService.deleteTeamMember(id).subscribe({
            next: () => {
              this.team = this.team.filter(t => t.id !== id);
              Swal.fire('Deleted!', 'Team Member has been deleted.', 'success');
            },
            error: (err) => {
              console.error('Error deleting team member:', err);
              Swal.fire('Error!', 'Failed to delete team member.', 'error');
            }
          });
        }
      });
    }
}
