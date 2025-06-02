import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/aura';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Lara,
                options: {
                    darkModeSelector: '.app-dark'
                }
            },
            translation: {
                startsWith: 'Empieza por',
                contains: 'Contiene',
                notContains: 'No contiene',
                endsWith: 'Termina en',
                equals: 'Igual a',
                notEquals: 'Distinto de',
                noFilter: 'Sin filtro',
                lt: 'Menor que',
                lte: 'Menor o igual que',
                gt: 'Mayor que',
                gte: 'Mayor o igual que',
                dateIs: 'Es la fecha',
                dateIsNot: 'No es la fecha',
                dateBefore: 'Antes de',
                dateAfter: 'Después de',
                clear: 'Limpiar',
                apply: 'Aplicar',
                matchAll: 'Coincidir todos',
                matchAny: 'Coincidir cualquiera',
                addRule: 'Añadir regla',
                removeRule: 'Eliminar regla',
                accept: 'Aceptar',
                reject: 'Rechazar',
                choose: 'Elegir',
                upload: 'Subir',
                cancel: 'Cancelar',
                dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
                dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
                dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
                chooseYear: 'Elegir año',
                chooseMonth: 'Elegir mes',
                chooseDate: 'Elegir fecha',
                today: 'Hoy',
                weekHeader: 'Sem',
                firstDayOfWeek: 1,
                dateFormat: 'dd/mm/yy',
                weak: 'Débil',
                medium: 'Medio',
                strong: 'Fuerte',
                passwordPrompt: 'Introduce una contraseña',
                emptyFilterMessage: 'No se encontraron resultados',
                searchMessage: '{0} resultados disponibles',
                selectionMessage: '{0} elementos seleccionados',
                emptySelectionMessage: 'Sin elementos seleccionados',
                emptySearchMessage: 'No se encontraron resultados',
                emptyMessage: 'No hay opciones disponibles',
                aria: {
                    trueLabel: 'Verdadero',
                    falseLabel: 'Falso',
                    nullLabel: 'No seleccionado',
                    star: '1 estrella',
                    stars: '{star} estrellas',
                    selectAll: 'Todos seleccionados',
                    unselectAll: 'Todos deseleccionados',
                    close: 'Cerrar',
                    previous: 'Anterior',
                    next: 'Siguiente',
                    navigation: 'Navegación',
                    scrollTop: 'Ir arriba',
                    moveTop: 'Mover arriba',
                    moveUp: 'Subir',
                    moveDown: 'Bajar',
                    moveBottom: 'Mover abajo',
                    moveToTarget: 'Mover al destino',
                    moveToSource: 'Mover al origen',
                    moveAllToTarget: 'Mover todo al destino',
                    moveAllToSource: 'Mover todo al origen',
                    pageLabel: '{page}',
                    firstPageLabel: 'Primera página',
                    lastPageLabel: 'Última página',
                    nextPageLabel: 'Siguiente página',
                    prevPageLabel: 'Página anterior',
                    rowsPerPageLabel: 'Filas por página',
                    jumpToPageDropdownLabel: 'Saltar a página (desplegable)',
                    jumpToPageInputLabel: 'Saltar a página (input)',
                    selectRow: 'Fila seleccionada',
                    unselectRow: 'Fila deseleccionada',
                    expandRow: 'Expandir fila',
                    collapseRow: 'Colapsar fila',
                    showFilterMenu: 'Mostrar filtro',
                    hideFilterMenu: 'Ocultar filtro',
                    filterOperator: 'Operador de filtro',
                    filterConstraint: 'Restricción de filtro',
                    editRow: 'Editar fila',
                    saveEdit: 'Guardar edición',
                    cancelEdit: 'Cancelar edición',
                    listView: 'Vista de lista',
                    gridView: 'Vista de cuadrícula',
                    slide: 'Diapositiva',
                    slideNumber: 'Diapositiva {slideNumber}',
                    zoomImage: 'Ampliar imagen',
                    zoomIn: 'Acercar',
                    zoomOut: 'Alejar',
                    rotateRight: 'Girar a la derecha',
                    rotateLeft: 'Girar a la izquierda'
                }
            }
        })
    ]
};
