import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Warehouse } from '../../../inventario/model/warehouse.model';
import { PERMISO_FULL_ACCESS, PERMISO_VIEW_INVENTORY, PERMISO_VIEW_REPORTS, PERMISO_VIEW_STATS } from '../../../common/constants';
import { NgxParticlesModule } from '@tsparticles/angular';
import { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

@Component({
  selector: 'app-home',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [
    CommonModule,
    CardModule,
    PanelModule,
    ButtonModule,
    NgxParticlesModule
  ]
})
export class WelcomeComponent implements OnInit {
   particlesOptions: ISourceOptions = {
    duration : 10000000,
    pauseOnOutsideViewport: false,
    pauseOnBlur: false,
    autoPlay: true,
    background: {
      color: { value: "#ffffff" }
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: "#000"
      },
      links: {
        enable: true,
        color: "#000"
      },
      move: {
        enable: true
      },
      number: {
        value: 50,
      },
      size: {
        value: { min: 2, max: 4 }
      },
    }
  };

  username: string = '';
  currentTime: string = '';
  inventorySummary: string = '';
  esAdmin: boolean = false;
  esMarketing: boolean = false;
  esReponedor: boolean = false;
  warehouse!: Warehouse

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    this.loadUsername();
    this.updateTime();
    if(this.authService.hasPermiso(PERMISO_FULL_ACCESS)) {
      this.esAdmin = true;
      this.esReponedor = true;
    } else if(this.authService.hasPermiso(PERMISO_VIEW_STATS) || this.authService.hasPermiso(PERMISO_VIEW_REPORTS)) {
      this.esMarketing = true;
    }
    else if(this.authService.hasPermiso(PERMISO_VIEW_INVENTORY)) {
      this.esReponedor = true;
      this.loadLocation();
    }
    else {
      this.loadLocation();
    }
    setInterval(() => this.updateTime(), 1000);
  }

  private loadUsername() {
    this.username = this.authService.getUsername();
  }

  private async loadLocation() {
    this.warehouse = await this.authService.getLocation();
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  navigateInventory() {
    this.router.navigate(['/inventario']);
  }

  navigateStats(): void {
    this.router.navigate(['/stats']);
  }

  particlesLoaded(event: any): void {
    console.log(event);
  }
}
