import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { HomeComponent as RootComponent } from '../pages/home/home.component';
import { DetailComponent } from '../pages/job-applicants/detail/detail.component';
import { JobsComponent } from '../pages/jobs/jobs.component';
import { CreateJobComponent } from '../pages/jobs/create-job/create-job.component';
import { JobApplicantsComponent } from '../pages/job-applicants/job-applicants.component';
import { NotificationComponent } from '../pages/notification/notification.component';
import { CmsComponent } from '../pages/cms/cms.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { EditComponent } from '../pages/cms/edit/edit.component';
import { HomeComponent } from '../pages/cms/edit/home/home.component';
import { AboutComponent } from '../pages/cms/edit/about/about.component';
import { ServicesComponent } from '../pages/cms/edit/services/services.component';
import { ManagementComponent } from '../pages/cms/edit/management/management.component';
// import { CareerComponent } from '../pages/cms/edit/career/career.component';
import { ContactComponent } from '../pages/cms/edit/contact/contact.component';
import { CrudComponent } from '../pages/crud/crud.component';
import { HomeTestimonialComponent } from '../pages/crud/home-testimonial/home-testimonial.component';
import { HomeTestimonialAddComponent } from '../pages/crud/home-testimonial/add/home-testimonial-add.component';
import { HomeTestimonialEditComponent } from '../pages/crud/home-testimonial/edit/home-testimonial-edit.component';
import { PartnersComponent } from '../pages/crud/partners/partners.component';
import { PartnerAddComponent } from '../pages/crud/partners/add/partner-add.component';
import { PartnerEditComponent } from '../pages/crud/partners/edit/partner-edit.component';
import { ClientsComponent } from '../pages/crud/clients/clients.component';
import { ClientAddComponent } from '../pages/crud/clients/add/client-add.component';
import { ClientEditComponent } from '../pages/crud/clients/edit/client-edit.component';
import { TeamComponent } from '../pages/crud/team/team.component';
import { TeamAddComponent } from '../pages/crud/team/add/team-add.component';
import { TeamEditComponent } from '../pages/crud/team/edit/team-edit.component';
import { ServiceCategoryComponent } from '../pages/crud/service-category/service-category.component';
import { CategoryAddComponent } from '../pages/crud/service-category/add/category-add.component';
import { CategoryEditComponent } from '../pages/crud/service-category/edit/category-edit.component';
import { ClientServiceComponent } from '../pages/crud/client-service/client-service.component';
import { ServiceAddComponent } from '../pages/crud/client-service/add/service-add.component';
import { ServiceEditComponent } from '../pages/crud/client-service/edit/service-edit.component';
import { JobApplicationComponent } from '../pages/jobs/job-application/job-application.component';
import { ContactRequestComponent } from '../pages/contact-request/contact-request.component';
import { ContactRequestDetailComponent } from '../pages/contact-request/detail/detail.component';
import { JobCategoriesComponent } from './job-categories/job-categories.component';
import { JobCategoriesAddComponent } from './job-categories/add/job-categories-add.component';
import { JobCategoriesEditComponent } from './job-categories/edit/job-categories-edit.component';
import { JobEditComponent } from './jobs/edit/job-edit.component';
import { PermissionGuard } from '../permission/permission.guard';
import { SitemapComponent } from '../pages/cms/edit/sitemap/sitemap.component';
import { VacancyComponent } from '../pages/cms/edit/vacancy/vacancy.component';
import { PartnersComponent as CMSPartnerComponent } from '../pages/cms/edit/partners/partners.component';

export const PAGES_ROUTES: Routes = [
    { path: '', component: RootComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'job-applicants/details/:id', component: DetailComponent },
    { path: 'jobs', component: JobsComponent },
    { path: 'job/edit/:id', component: JobEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Job', action: 'update' } } },
    { path: 'job-applicants', component: JobApplicantsComponent },
    { path: 'job-applicants/:jobId', component: JobApplicantsComponent },
    { path: 'jobs/create', component: CreateJobComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Job', action: 'create' } } },
    { path: 'job-categories', component: JobCategoriesComponent },
    { path: 'job-categories/create', component: JobCategoriesAddComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Job', action: 'create' } } },
    { path: 'job-categories/edit/:id', component: JobCategoriesEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Job', action: 'update' } } },
    { path: 'notifications', component: NotificationComponent },
    { path: 'cms', component: CmsComponent },
    { path: 'cms/edit', component: EditComponent },
    { path: 'cms/edit/home', component: HomeComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Home', action: 'update' } } },
    { path: 'cms/edit/about', component: AboutComponent, canActivate: [PermissionGuard], data: { permission: { module: 'AboutUs', action: 'update' } } },
    { path: 'cms/edit/services', component: ServicesComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Services', action: 'update' } } },
    { path: 'cms/edit/management', component: ManagementComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Management', action: 'update' } } },
    // { path: 'cms/edit/career', component: CareerComponent },
    { path: 'cms/edit/contact', component: ContactComponent, canActivate: [PermissionGuard], data: { permission: { module: 'ContactUs', action: 'update' } } },
    { path: 'cms/edit/partners', component: CMSPartnerComponent , canActivate: [PermissionGuard], data: { permission: { module: 'ContactUs', action: 'update' } } },
    { path: 'cms/edit/sitemap', component: SitemapComponent, canActivate: [PermissionGuard], data: { permission: { module: 'AboutUs', action: 'update' } } },
    { path: 'cms/edit/vacancy', component: VacancyComponent, canActivate: [PermissionGuard], data: { permission: { module: 'AboutUs', action: 'update' } } },
    { path: 'crud', component: CrudComponent },
    { path: 'crud/home-testimonial', component: HomeTestimonialComponent },
    { path: 'crud/home-testimonial/add', component: HomeTestimonialAddComponent },
    { path: 'crud/home-testimonial/edit/:id', component: HomeTestimonialEditComponent },
    { path: 'crud/partner', component: PartnersComponent },
    { path: 'crud/partner/add', component: PartnerAddComponent },
    { path: 'crud/partner/edit/:id', component: PartnerEditComponent },
    { path: 'crud/client', component: ClientsComponent },
    { path: 'crud/client/add', component: ClientAddComponent, canActivate: [PermissionGuard], data: { permission: { module: 'AboutUs', action: 'create' } } },
    { path: 'crud/client/edit/:id', component: ClientEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'AboutUs', action: 'update' } } },
    { path: 'crud/team', component: TeamComponent },
    { path: 'crud/team/add', component: TeamAddComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Team', action: 'create' } } },
    { path: 'crud/team/edit/:id', component: TeamEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Team', action: 'update' } } },
    { path: 'crud/service-category', component: ServiceCategoryComponent },
    { path: 'crud/service-category/add', component: CategoryAddComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Services', action: 'create' } } },
    { path: 'crud/service-category/edit/:id', component: CategoryEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Services', action: 'update' } } },
    { path: 'crud/client-service', component: ClientServiceComponent },
    { path: 'crud/client-service/add', component: ServiceAddComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Services', action: 'create' } } },
    { path: 'crud/client-service/edit/:id', component: ServiceEditComponent, canActivate: [PermissionGuard], data: { permission: { module: 'Services', action: 'update' } } },
    { path: 'profile', component: ProfileComponent},
    { path: 'job-application', component:JobApplicationComponent },
    { path: 'contact-request', component:ContactRequestComponent },
    { path: 'contact-request/details/:id', component: ContactRequestDetailComponent }
];