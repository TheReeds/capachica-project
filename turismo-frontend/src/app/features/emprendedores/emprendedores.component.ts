// src/app/features/emprendedores/emprendedores.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmprendedorService } from './emprendedores.service';
import { Emprendedor, EmprendedorDTO } from './emprendedor.model';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout/admin-layout.component';
import { PaginatedResponse } from '../../core/services/admin.service';

@Component({
  selector: 'app-emprendedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './emprendedores.component.html',
  styleUrls: ['./emprendedores.component.css']
})
export class EmprendedoresComponent implements OnInit {
  private emprendedorService = inject(EmprendedorService);
  private fb = inject(FormBuilder);
  
  emprendedores: Emprendedor[] = [];
  paginacion: PaginatedResponse<Emprendedor> | null = null;
  loading = true;
  currentPage = 1;
  searchTerm = '';
  
  // Para el modal de crear/editar
  emprendedorForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentEmprendedorId: number | null = null;
  
  constructor() {
    this.emprendedorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      descripcion: [''],
      estado: [true]
    });
  }
  
  ngOnInit() {
    this.loadEmprendedores();
  }
  
  loadEmprendedores(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    
    this.emprendedorService.getEmprendedores(page, 10, this.searchTerm).subscribe({
      next: (data) => {
        this.paginacion = data;
        this.emprendedores = data.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar emprendedores:', error);
        this.loading = false;
      }
    });
  }
  
  search() {
    this.loadEmprendedores(1);
  }
  
  openCreateModal() {
    this.isEditing = false;
    this.currentEmprendedorId = null;
    this.emprendedorForm.reset({estado: true});
    this.isModalOpen = true;
  }
  
  openEditModal(emprendedor: Emprendedor) {
    this.isEditing = true;
    this.currentEmprendedorId = emprendedor.id;
    this.emprendedorForm.patchValue({
      nombre: emprendedor.nombre,
      email: emprendedor.email,
      telefono: emprendedor.telefono,
      descripcion: emprendedor.descripcion,
      estado: emprendedor.estado
    });
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
  }
  
  saveEmprendedor() {
    if (this.emprendedorForm.invalid) {
      this.emprendedorForm.markAllAsTouched();
      return;
    }
    
    const emprendedorData: EmprendedorDTO = this.emprendedorForm.value;
    
    if (this.isEditing && this.currentEmprendedorId) {
      this.emprendedorService.updateEmprendedor(this.currentEmprendedorId, emprendedorData).subscribe({
        next: () => {
          this.loadEmprendedores(this.currentPage);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar emprendedor:', error);
        }
      });
    } else {
      this.emprendedorService.createEmprendedor(emprendedorData).subscribe({
        next: () => {
          this.loadEmprendedores(this.currentPage);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear emprendedor:', error);
        }
      });
    }
  }
  
  deleteEmprendedor(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este emprendedor?')) {
      this.emprendedorService.deleteEmprendedor(id).subscribe({
        next: () => {
          this.loadEmprendedores(this.currentPage);
        },
        error: (error) => {
          console.error('Error al eliminar emprendedor:', error);
        }
      });
    }
  }
  
  toggleEstado(emprendedor: Emprendedor) {
    this.emprendedorService.toggleEstado(emprendedor.id, !emprendedor.estado).subscribe({
      next: () => {
        this.loadEmprendedores(this.currentPage);
      },
      error: (error) => {
        console.error('Error al cambiar estado del emprendedor:', error);
      }
    });
  }
  
  changePage(page: number) {
    this.loadEmprendedores(page);
  }
  
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}