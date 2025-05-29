/**
 * Autor: Eduardo García Romera
 * DNI: 54487155V
 * Correo: egarcia3266@alumno.uned.es
 * Título: Desarrollo de una aplicación para la gestión de inventario Online
 * Descripción: Página de estadísticas con gráficos de ventas y productos.
 * Trabajo de Fin de Grado - UNED
 * Derechos: Este código es propiedad de Eduardo García Romera y se reserva el derecho de uso, distribución y modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { InventoryService } from '../../../inventario/services/inventario.service';
import { WarehouseService } from '../../../inventario/services/warehouse.service';
import { AuthService } from '../../../auth/services/auth.service';
import { TransactionService } from '../../../movimientos/services/transaction.service';
import { Transaction } from '../../../movimientos/model/transaction.model';
import { Inventory } from '../../../inventario/model/inventory.model';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DatePickerModule  } from 'primeng/datepicker';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, ChartModule, SelectModule, FormsModule, ButtonModule, TabViewModule, DatePickerModule],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  cargando: boolean = true;
  movimientos!: Transaction[];
  productos!: Inventory[];
  rangoFechas!: Date[];


  chartVentasPorCategoria: any;
  chartTipoTransaccion: any;
  chartVentasPorAlmacen: any;
  chartRankingEmpleados: any;
  chartRankingProductos: any;
  chartVentasMensuales: any = null;

  productoSeleccionado: Inventory | null = null;
  skuSeleccionado: string | null = null;

  optionsHorizontal = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        },
        title: {
          display: true,
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        }
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        },
        title: {
          display: true,
          color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
        }
      }
    }
  };
  

  optionsR = {
  indexAxis: 'x',
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
    }
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
      }
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color') 
      }
    }
  }
}
}; 

optionsV = {
  indexAxis: 'x',
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    },
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      },
      title: {
        display: true,
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      },
      title: {
        display: true,
        text: 'Cantidad',
        color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-color')
      }
    }
  }
};


  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private warehouseService: WarehouseService,
    private transactionService: TransactionService,
    private reportService: ReportService
  ) {}

  async ngOnInit(): Promise<void> {
    this.transactionService.getTransactions().subscribe((data) => {
      this.movimientos = data;
      this.movimientos.sort((a, b) => a.id - b.id);
      this.prepararChartVentasPorCategoria();
      this.prepararChartPorTipo();
      this.prepararChartVentasPorAlmacen();
      this.prepararChartRankingEmpleados();
      this.prepararChartRankingProductos();

      this.inventoryService.getInventory().subscribe((data) => {
        this.productos = data;
        this.productos = this.productos.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.product.sku === value.product.sku
          ))
        );
        // El producto debe de tener algun movimiento asociado de tipo SALE
        this.productos = this.productos.filter((p) => {
          return this.movimientos.some((m) => m.product.sku === p.product.sku && m.type.toString() === 'SALE');
        });
      }); 
      this.cargando = false;
    });    
  }

  prepararChartVentasPorCategoria() {
    const ventas = this.movimientos.filter(m => m.type.toString() === 'SALE');
    const agregadas = new Map<string, number>();
  
    ventas.forEach(t => {
      const categoria = t.product.category?.name || 'Sin categoría';
      agregadas.set(categoria, (agregadas.get(categoria) || 0) + t.quantity);
    });
  
    const ordenadas = Array.from(agregadas.entries()).sort((a, b) => b[1] - a[1]);
  
    this.chartVentasPorCategoria = {
      labels: ordenadas.map(([cat]) => cat),
      datasets: [
        {
          label: 'Ventas por categoría',
          data: ordenadas.map(([_, cantidad]) => cantidad),
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }
  

   prepararChartPorTipo() {
    const tipos: Array<'ADD' | 'REMOVE' | 'SALE'> = ['ADD', 'REMOVE', 'SALE'];
    const traducciones: { [key in 'ADD' | 'REMOVE' | 'SALE']: string } = {
      ADD: 'Reposiciones',
      REMOVE: 'Eliminaciones',
      SALE: 'Ventas'
    };
  
    const conteo = { 'ADD': 0, 'REMOVE': 0, 'SALE': 0 };
  
    this.movimientos.forEach(m => {
      conteo[m.type as unknown as 'ADD' | 'REMOVE' | 'SALE'] += 1;
    });
  
    this.chartTipoTransaccion = {
      labels: tipos.map(t => traducciones[t]),
      datasets: [
        {
          data: tipos.map((t: 'ADD' | 'REMOVE' | 'SALE') => conteo[t]),
          backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
          hoverBackgroundColor: ['#81C784', '#FFB74D', '#E57373']
        }
      ]
    };
  }

  prepararChartVentasPorAlmacen() {
    const ventas = this.movimientos.filter(m => m.type.toString() === 'SALE');
    const conteo = new Map<string, number>();

    ventas.forEach(m => {
      const almacen = m.warehouse.name;
      conteo.set(almacen, (conteo.get(almacen) || 0) + m.quantity);
    });

    this.chartVentasPorAlmacen = {
      labels: Array.from(conteo.keys()),
      datasets: [
        {
          label: 'Ventas por almacén',
          data: Array.from(conteo.values()),
          backgroundColor: '#9CCC65'
        }
      ]
    };
  }
  
  onSkuChange() {
    if (!this.productoSeleccionado) return;
    this.skuSeleccionado = this.productoSeleccionado.product.sku;
    console.log(this.skuSeleccionado);
    this.obtenerVentasPorSku(this.skuSeleccionado);
  }

  prepararChartRankingEmpleados() {
    const ventas = this.movimientos.filter(m => m.type.toString() === 'SALE');
    const empleados = new Map<string, number>();
  
    ventas.forEach(m => {
      const empleado = m.user?.username || 'Desconocido';
      empleados.set(empleado, (empleados.get(empleado) || 0) + m.quantity);
    });
  
    const ordenados = Array.from(empleados.entries()).sort((a, b) => a[1] - b[1]);
  
    this.chartRankingEmpleados = {
      labels: ordenados.map(([empleado]) => empleado),
      datasets: [
        {
          label: 'Ventas por empleado',
          data: ordenados.map(([_, cantidad]) => cantidad),
          backgroundColor: '#26A69A'
        }
      ]
    };
  }
  

  prepararChartRankingProductos() {
    const ventas = this.movimientos.filter(m => m.type.toString() === 'SALE');
    const conteo = new Map<string, number>();

    ventas.forEach(m => {
      const producto = m.product.name;
      conteo.set(producto, (conteo.get(producto) || 0) + m.quantity);
    });

    const ordenados = Array.from(conteo.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5 productos

    this.chartRankingProductos = {
      labels: ordenados.map(([nombre]) => nombre),
      datasets: [
        {
          label: 'Top 5 productos más vendidos',
          data: ordenados.map(([, cantidad]) => cantidad),
          backgroundColor: '#FF7043'
        }
      ]
    };
  }

  obtenerVentasPorSku(sku: string) {
  if (!sku) {
    this.chartVentasMensuales = null;
    return;
  }
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const añoActual = ahora.getFullYear();

  const mesesAño = [];
  for (let i = 11; i >= 0; i--) {
    const fecha = new Date(añoActual, mesActual - i, 1);
    const mesNombre = fecha.toLocaleString('es', { month: 'long' });
    const mesCapitalizado = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1).toLowerCase();
    mesesAño.push(`${mesCapitalizado} ${fecha.getFullYear()}`);
  }

  const ventas = this.movimientos.filter(m =>
    m.product.sku === sku && m.type.toString() === 'SALE'
  );

  const conteo = new Map<string, number>();
  ventas.forEach(m => {
    const fecha = new Date(m.createdAt);
    const mesNombre = fecha.toLocaleString('es', { month: 'long' });
    const mesCapitalizado = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1).toLowerCase();
    const clave = `${mesCapitalizado} ${fecha.getFullYear()}`;
    conteo.set(clave, (conteo.get(clave) || 0) + m.quantity);
  });

  const cantidades = mesesAño.map(m => conteo.get(m) || 0);

  this.chartVentasMensuales = {
    labels: mesesAño,
    datasets: [
      {
        label: `Ventas mensuales (${sku})`,
        data: cantidades,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  };
}


  generarReportePDF() {
  const sku = this.skuSeleccionado ?? '';

    this.reportService.generarEstadisticasPDF(sku).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_estadisticas.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al generar el PDF:', error);
        alert('No se pudo generar el reporte. Inténtalo más tarde.');
      }
    });
  }

  filtrarPorRango() {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      const [fechaInicio, fechaFin] = this.rangoFechas;
      const inicio = fechaInicio.getTime();
      const fin = fechaFin.getTime();

      this.movimientos = this.movimientos.filter(m => {
        const fechaMovimiento = new Date(m.createdAt).getTime();
        return fechaMovimiento >= inicio && fechaMovimiento <= fin;
      });

      this.prepararChartVentasPorCategoria();
      this.prepararChartPorTipo();
      this.prepararChartVentasPorAlmacen();
      this.prepararChartRankingEmpleados();
      this.prepararChartRankingProductos();
      this.obtenerVentasPorSku(this.skuSeleccionado || '');
    }
  }

  async limpiarFiltroFechas() {
    this.rangoFechas = [];
    await this.ngOnInit();
    this.obtenerVentasPorSku(this.skuSeleccionado || '');
  }
}
