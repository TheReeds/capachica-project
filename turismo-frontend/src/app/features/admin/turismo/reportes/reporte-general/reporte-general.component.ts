// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { TurismoService, Emprendedor } from '../../../../../core/services/turismo.service';
//
// @Component({
//   selector: 'app-reporte-general',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   template: `
//     <div class="space-y-6">
//       <div class="sm:flex sm:items-center sm:justify-between">
//         <div>
//           <h1 class="text-2xl font-bold text-gray-900">Reporte General de Emprendedores</h1>
//           <p class="mt-1 text-sm text-gray-500">
//             Visualice un resumen general de todos los emprendedores registrados.
//           </p>
//         </div>
//       </div>
//
//       <div class="rounded-lg bg-white shadow-sm overflow-hidden">
//         @if (loading) {
//           <div class="flex justify-center items-center p-8">
//             <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
//             <span class="ml-4">Cargando emprendedores...</span>
//           </div>
//         } @else if (emprendedores.length === 0) {
//           <div class="p-8 text-center">
//             <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//             </svg>
//             <h3 class="mt-2 text-sm font-medium text-gray-900">No hay emprendedores</h3>
//             <p class="mt-1 text-sm text-gray-500">Aún no se han registrado emprendedores en el sistema.</p>
//           </div>
//         } @else {
//           <div class="overflow-x-auto">
//             <table class="min-w-full divide-y divide-gray-200">
//               <thead class="bg-gray-50">
//               <tr>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Servicio</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
//               </tr>
//               </thead>
//               <tbody class="bg-white divide-y divide-gray-200">
//                 @for (emprendedor of emprendedores; track emprendedor.id) {
//                   <tr>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                       <div class="text-sm font-medium text-gray-900">{{ emprendedor.nombre }}</div>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                       <div class="text-sm text-gray-500">{{ emprendedor.email }}</div>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                       <div class="text-sm text-gray-900">{{ emprendedor.tipo_servicio }}</div>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                       <span class="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
//                         {{ emprendedor.categoria }}
//                       </span>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                       <div class="text-sm text-gray-500">{{ emprendedor.ubicacion }}</div>
//                     </td>
//                   </tr>
//                 }
//               </tbody>
//             </table>
//           </div>
//         }
//       </div>
//     </div>
//   `
// })
//
// export class ReporteGeneralComponent implements OnInit {
//   private turismoService = inject(TurismoService);
//
//   emprendedores: Emprendedor[] = [];
//   loading = false;
// }
