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
import { CalendarModule } from 'primeng/calendar';
import { Warehouse } from '../../../inventario/model/warehouse.model';
import { Category } from '../../../inventario/model/category.model';
import { CategoryService } from '../../../inventario/services/category.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, ChartModule, SelectModule, FormsModule, ButtonModule, TabViewModule, DatePickerModule, CalendarModule],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  cargando: boolean = true;
  movimientos!: Transaction[];
  movimientosFiltrados!: Transaction[];
  productos!: Inventory[];
  productosFiltrados!: Inventory[];
  rangoFechas: Date[] = [];
  almacenes!: Warehouse[];
  almacenSeleccionado: Warehouse | null = null;
  categorias!: Category[];
  categoriaSeleccionada: Category | null = null;

  es: any;
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
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private reportService: ReportService
  ) {}

  async ngOnInit(): Promise<void> {
    this.almacenes = (await this.warehouseService.getWarehouses().toPromise()) ?? [];
    this.categorias = (await this.categoryService.getCategories().toPromise()) ?? [];
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
      dayNamesShort: ['dom','lun','mar','mié','jue','vie','sáb'],
      dayNamesMin: ['D','L','M','X','J','V','S'],
      monthNames: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
      monthNamesShort: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    };
    this.transactionService.getTransactions().subscribe((data) => {
      this.movimientos = data;
      this.movimientos.sort((a, b) => a.id - b.id);
      this.movimientosFiltrados = this.movimientos;
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
        this.productos = this.productos
          .filter((p) => {
            return this.movimientos.some((m) => m.product.sku === p.product.sku && m.type.toString() === 'SALE');
          })
          .map((inventory) => ({
            ...inventory,
            label: `${inventory.product.name} (${inventory.product.sku})`
          }));
          this.productosFiltrados = this.productos;
      }); 
      this.cargando = false;
    });    
  }

  prepararChartVentasPorCategoria() {
    const ventas = this.movimientosFiltrados.filter(m => m.type.toString() === 'SALE');
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
  
    this.movimientosFiltrados.forEach(m => {
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
    const ventas = this.movimientosFiltrados.filter(m => m.type.toString() === 'SALE');
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
    if (this.productoSeleccionado){
      this.skuSeleccionado = this.productoSeleccionado.product.sku;
      console.log(this.skuSeleccionado);
      this.obtenerVentasPorSku(this.skuSeleccionado);
    }else {
      this.skuSeleccionado = null;
      this.chartVentasMensuales = null;
    }
  }

  prepararChartRankingEmpleados() {
    const ventas = this.movimientosFiltrados.filter(m => m.type.toString() === 'SALE');
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
    const ventas = this.movimientosFiltrados.filter(m => m.type.toString() === 'SALE');
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

  const ventas = this.movimientosFiltrados.filter(m =>
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
  const almacenSeleccionado = this.almacenSeleccionado ? this.almacenSeleccionado.id : '';
  const categoriaSeleccionada = this.categoriaSeleccionada ? this.categoriaSeleccionada.id : '';
  const fechaInicio = this.rangoFechas[0] ? this.rangoFechas[0].toISOString() : '';
  const fechaFin = this.rangoFechas[1] ? this.rangoFechas[1].toISOString() : '';

  console.log('Generando reporte PDF con los siguientes parámetros:');
  console.log('SKU:', sku);
  console.log('Almacén seleccionado:', almacenSeleccionado);
  console.log('Categoría seleccionada:', categoriaSeleccionada);
  console.log('Rango de fechas:', fechaInicio, 'a', fechaFin);

    this.reportService.generarEstadisticasPDF(sku, almacenSeleccionado, categoriaSeleccionada, fechaInicio, fechaFin).subscribe({
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

  filtrar() {
    this.movimientosFiltrados = this.movimientos;
    this.productosFiltrados = this.productos;
    if (this.rangoFechas && this.rangoFechas.length === 2 && this.rangoFechas[0] && this.rangoFechas[1]) {
      const [fechaInicio, fechaFin] = this.rangoFechas;
      const inicio = fechaInicio.getTime();
      const fin = fechaFin.getTime();

      this.movimientosFiltrados = this.movimientosFiltrados.filter(m => {
        const fechaMovimiento = new Date(m.createdAt).getTime();
        return fechaMovimiento >= inicio && fechaMovimiento <= fin;
      });
    }

    if (this.categoriaSeleccionada) {
      this.productoSeleccionado = null;
      this.movimientosFiltrados = this.movimientosFiltrados.filter(m => m.product.category?.id === this.categoriaSeleccionada!.id);
      this.productosFiltrados = this.productos
          .filter((p) => {
            return this.movimientosFiltrados.some((m) => m.product.sku === p.product.sku && m.type.toString() === 'SALE');
          })
          .map((inventory) => ({
            ...inventory,
            label: `${inventory.product.name} (${inventory.product.sku})`
          }));
    }

    if (this.almacenSeleccionado) {
      this.movimientosFiltrados = this.movimientosFiltrados.filter(m => m.warehouse.id === this.almacenSeleccionado!.id);
    }

    this.prepararChartVentasPorCategoria();
    this.prepararChartPorTipo();
    this.prepararChartVentasPorAlmacen();
    this.prepararChartRankingEmpleados();
    this.prepararChartRankingProductos();
    this.obtenerVentasPorSku(this.skuSeleccionado || '');
  }

  async limpiarFiltroFechas() {
    this.movimientosFiltrados = this.movimientos;
    this.rangoFechas = [];
    await this.ngOnInit();
    this.obtenerVentasPorSku(this.skuSeleccionado || '');
  }
}
