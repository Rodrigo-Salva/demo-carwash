// Mock Data
const mockData = {
    orders: [
        { id: 'ORD-001', date: '2023-10-25 10:30', client: 'Juan Pérez', plate: 'ABC-123', service: 'Lavado Completo', washer: 'Carlos Díaz', status: 'En proceso', total: 45.00, progress: 2 },
        { id: 'ORD-002', date: '2023-10-25 09:15', client: 'María Gómez', plate: 'XYZ-789', service: 'Lavado Básico', washer: 'Luis Mendoza', status: 'Completado', total: 25.00, progress: 4 },
        { id: 'ORD-003', date: '2023-10-25 11:00', client: 'Pedro Castillo', plate: 'DEF-456', service: 'Lavado Premium', washer: '-', status: 'Pendiente', total: 70.00, progress: 1 },
        { id: 'ORD-004', date: '2023-10-25 08:30', client: 'Ana Torres', plate: 'GHI-012', service: 'Pulido de Pintura', washer: 'Carlos Díaz', status: 'Completado', total: 120.00, progress: 4 }
    ],
    clients: [
        { name: 'Juan Pérez', doc: '71234567', phone: '987654321', email: 'juan@email.com', visits: 5 },
        { name: 'María Gómez', doc: '76543210', phone: '912345678', email: 'maria@email.com', visits: 12 },
        { name: 'Pedro Castillo', doc: '70001111', phone: '999888777', email: 'pedro@email.com', visits: 1 },
        { name: 'Ana Torres', doc: '72223333', phone: '911222333', email: 'ana@email.com', visits: 2 }
    ],
    vehicles: [
        { plate: 'ABC-123', brand: 'Toyota', model: 'Yaris', year: '2019', color: 'Rojo', client: 'Juan Pérez' },
        { plate: 'XYZ-789', brand: 'Kia', model: 'Rio', year: '2021', color: 'Plata', client: 'María Gómez' },
        { plate: 'DEF-456', brand: 'Hyundai', model: 'Tucson', year: '2022', color: 'Negro', client: 'Pedro Castillo' },
        { plate: 'GHI-012', brand: 'Honda', model: 'Civic', year: '2020', color: 'Azul', client: 'Ana Torres' }
    ],
    services: [
        { id: 1, name: 'Lavado Básico', price: 25.00, desc: 'Lavado exterior, aspirado y limpieza de lunas.', icon: 'fa-shower' },
        { id: 2, name: 'Lavado Completo', price: 45.00, desc: 'Básico + silicona interior, encerado rápido.', icon: 'fa-car-burst' },
        { id: 3, name: 'Lavado Premium', price: 70.00, desc: 'Completo + lavado de motor y chasis.', icon: 'fa-gem' },
        { id: 4, name: 'Pulido de Pintura', price: 120.00, desc: 'Pulido a máquina, corrección de rayones y cera.', icon: 'fa-wand-magic-sparkles' }
    ],
    washers: [
        { name: 'Carlos Díaz', avatar: 'https://i.pravatar.cc/150?img=12', status: 'Lavando', ordersToday: 4 },
        { name: 'Luis Mendoza', avatar: 'https://i.pravatar.cc/150?img=13', status: 'Disponible', ordersToday: 3 },
        { name: 'Miguel Ángel', avatar: 'https://i.pravatar.cc/150?img=14', status: 'Descanso', ordersToday: 5 }
    ],
    inventory: [
        { product: 'Champú para autos', category: 'Líquidos', stock: 15, unit: 'Galón', price: 35.00, status: 'Óptimo' },
        { product: 'Cera Líquida', category: 'Acabado', stock: 3, unit: 'Litro', price: 45.00, status: 'Bajo' },
        { product: 'Paños Microfibra', category: 'Accesorios', stock: 50, unit: 'Unidad', price: 5.00, status: 'Óptimo' },
        { product: 'Silicona UV', category: 'Interiores', stock: 0, unit: 'Litro', price: 30.00, status: 'Agotado' }
    ],
    payments: [
        { id: 'PAY-001', order: 'ORD-002', client: 'María Gómez', date: '25 Oct, 10:15', method: 'Yape', amount: 25.00, status: 'Pagado' },
        { id: 'PAY-002', order: 'ORD-004', client: 'Ana Torres', date: '25 Oct, 11:30', method: 'Tarjeta', amount: 120.00, status: 'Pagado' },
        { id: 'PAY-003', order: 'ORD-001', client: 'Juan Pérez', date: '25 Oct, --:--', method: 'Efectivo', amount: 45.00, status: 'Pendiente' }
    ]
};

// Utils
const formatMoney = (amount) => `S/ ${parseFloat(amount).toFixed(2)}`;

const getStatusBadge = (status) => {
    switch(status) {
        case 'Completado': case 'Pagado': case 'Óptimo': case 'Disponible': return `<span class="badge badge-success">${status}</span>`;
        case 'En proceso': case 'Lavando': return `<span class="badge badge-info">${status}</span>`;
        case 'Pendiente': case 'Bajo': case 'Descanso': return `<span class="badge badge-warning">${status}</span>`;
        case 'Cancelado': case 'Agotado': return `<span class="badge badge-danger">${status}</span>`;
        default: return `<span class="badge badge-gray">${status}</span>`;
    }
};

const getInvStatus = (stock) => {
    if(stock <= 0) return 'Agotado';
    if(stock <= 5) return 'Bajo';
    return 'Óptimo';
};

// Main App Object
const app = {
    currentOrderProgress: 1,
    currentOrderId: null,
    
    init() {
        this.bindEvents();
        this.renderAll();
    },

    bindEvents() {
        // Sidebar Navigation
        document.querySelectorAll('#nav-menu li').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('#nav-menu li').forEach(li => li.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.showPage(e.currentTarget.dataset.target);
                if(window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });

        // Mobile Sidebar Toggle
        document.getElementById('toggle-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });
        document.getElementById('close-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // Modals Close
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            });
        });

        // Filters
        document.getElementById('search-orders').addEventListener('input', (e) => this.renderOrders(e.target.value, document.getElementById('filter-orders-status').value));
        document.getElementById('filter-orders-status').addEventListener('change', (e) => this.renderOrders(document.getElementById('search-orders').value, e.target.value));
        document.getElementById('search-clients').addEventListener('input', (e) => this.renderClients(e.target.value));
        document.getElementById('global-search').addEventListener('input', (e) => {
            if(e.target.value) {
                this.showPage('orders');
                document.getElementById('search-orders').value = e.target.value;
                this.renderOrders(e.target.value);
            } else {
                this.renderOrders();
            }
        });

        // Forms Submissions
        document.getElementById('create-order-form').addEventListener('submit', (e) => this.handleOrderSubmit(e));
        document.getElementById('client-form').addEventListener('submit', (e) => this.handleClientSubmit(e));
        document.getElementById('vehicle-form').addEventListener('submit', (e) => this.handleVehicleSubmit(e));
        document.getElementById('service-form').addEventListener('submit', (e) => this.handleServiceSubmit(e));
        document.getElementById('washer-form').addEventListener('submit', (e) => this.handleWasherSubmit(e));
        document.getElementById('inventory-form').addEventListener('submit', (e) => this.handleInventorySubmit(e));
    },

    showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    },

    openModal(modalId) {
        if(modalId === 'order-modal') this.populateOrderForm();
        document.getElementById(modalId).classList.add('active');
    },

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        let icon = 'fa-circle-info';
        if(type === 'success') icon = 'fa-circle-check';
        if(type === 'warning') icon = 'fa-triangle-exclamation';
        if(type === 'danger') icon = 'fa-circle-xmark';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // --- Detail & Progress --- //

    viewOrderDetail(id) {
        const order = mockData.orders.find(o => o.id === id);
        if(!order) return;
        this.currentOrderId = id;
        document.getElementById('detail-order-id').innerText = `#${order.id}`;
        document.getElementById('detail-order-status').outerHTML = `<span id="detail-order-status">${getStatusBadge(order.status)}</span>`;
        document.getElementById('det-client').innerText = order.client;
        document.getElementById('det-plate').innerText = order.plate;
        document.getElementById('det-service').innerText = order.service;
        document.getElementById('det-washer').innerText = order.washer;
        document.getElementById('det-total').innerText = formatMoney(order.total);
        
        const client = mockData.clients.find(c => c.name === order.client);
        if(client) document.getElementById('det-phone').innerText = client.phone;
        
        const vehicle = mockData.vehicles.find(v => v.plate === order.plate);
        if(vehicle) {
            document.getElementById('det-car').innerText = `${vehicle.brand} ${vehicle.model}`;
            document.getElementById('det-color').innerText = vehicle.color;
        }

        this.currentOrderProgress = order.progress;
        this.updateProgressUI();
        this.showPage('order-detail');
    },

    updateProgressUI() {
        const steps = document.querySelectorAll('.progress-track .step');
        const fill = document.querySelector('.progress-bar-fill');
        steps.forEach((step, index) => {
            step.classList.remove('completed', 'active');
            if (index + 1 < this.currentOrderProgress) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentOrderProgress) {
                step.classList.add('active');
            }
        });
        const percentage = ((this.currentOrderProgress - 1) / (steps.length - 1)) * 100;
        fill.style.width = `${percentage}%`;
    },

    advanceOrderStatus() {
        if(this.currentOrderProgress < 4) {
            this.currentOrderProgress++;
            const order = mockData.orders.find(o => o.id === this.currentOrderId);
            order.progress = this.currentOrderProgress;
            
            let newStatus = 'En proceso';
            if(this.currentOrderProgress === 4) newStatus = 'Completado';
            order.status = newStatus;
            
            this.updateProgressUI();
            this.showToast('Estado de la orden actualizado', 'success');
            document.getElementById('detail-order-status').outerHTML = `<span id="detail-order-status">${getStatusBadge(newStatus)}</span>`;
            
            if(newStatus === 'Completado') {
                const w = mockData.washers.find(w => w.name === order.washer);
                if(w) w.status = 'Disponible';
                mockData.payments.push({ id: `PAY-00${mockData.payments.length+1}`, order: order.id, client: order.client, date: new Date().toLocaleDateString(), method: 'Efectivo', amount: order.total, status: 'Pendiente' });
            }
            this.renderAll();
        } else {
            this.showToast('La orden ya está completada', 'info');
        }
    },

    cancelOrder(id) {
        if(confirm(`¿Estás seguro de cancelar la orden ${id}?`)) {
            const order = mockData.orders.find(o => o.id === id);
            order.status = 'Cancelado';
            const w = mockData.washers.find(w => w.name === order.washer);
            if(w) w.status = 'Disponible';
            this.showToast('Orden cancelada', 'danger');
            this.renderAll();
        }
    },

    deleteClient(name) {
        if(confirm(`¿Eliminar al cliente ${name}?`)) {
            mockData.clients = mockData.clients.filter(c => c.name !== name);
            this.showToast('Cliente eliminado', 'warning');
            this.renderClients();
        }
    },

    // --- Forms Handling --- //

    populateOrderForm() {
        const clientSelect = document.getElementById('ord-client');
        clientSelect.innerHTML = '<option value="">Seleccione Cliente</option>' + mockData.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        
        const serviceSelect = document.getElementById('ord-service');
        serviceSelect.innerHTML = '<option value="">Seleccione Servicio</option>' + mockData.services.map(s => `<option value="${s.id}">${s.name} (${formatMoney(s.price)})</option>`).join('');
        
        const washerSelect = document.getElementById('ord-washer');
        washerSelect.innerHTML = '<option value="">Seleccione Lavador</option>' + mockData.washers.filter(w => w.status !== 'Descanso').map(w => `<option value="${w.name}">${w.name} - ${w.status}</option>`).join('');
    },

    filterVehiclesByClient() {
        const client = document.getElementById('ord-client').value;
        const plateSelect = document.getElementById('ord-plate');
        plateSelect.innerHTML = '<option value="">Seleccione Vehículo</option>';
        mockData.vehicles.filter(v => v.client === client).forEach(v => {
            plateSelect.innerHTML += `<option value="${v.plate}">${v.plate} - ${v.brand} ${v.model}</option>`;
        });
    },

    populateVehicleClientSelect() {
        const sel = document.getElementById('veh-client');
        sel.innerHTML = '<option value="">Seleccione Cliente</option>' + mockData.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    },

    handleOrderSubmit(e) {
        e.preventDefault();
        const client = document.getElementById('ord-client').value;
        const plate = document.getElementById('ord-plate').value;
        const srvId = document.getElementById('ord-service').value;
        const washer = document.getElementById('ord-washer').value;
        
        const service = mockData.services.find(s => s.id == srvId);
        
        const newOrder = {
            id: `ORD-00${mockData.orders.length + 1}`,
            date: new Date().toLocaleDateString() + ' ' + new Date().getHours() + ':00',
            client, plate, service: service.name, washer, status: 'Pendiente', total: service.price, progress: 1
        };
        mockData.orders.unshift(newOrder);
        
        const w = mockData.washers.find(w => w.name === washer);
        if(w) { w.status = 'Lavando'; w.ordersToday++; }

        this.closeAllModals();
        e.target.reset();
        this.showToast('Orden creada exitosamente', 'success');
        this.renderAll();
    },

    handleClientSubmit(e) {
        e.preventDefault();
        mockData.clients.push({
            name: document.getElementById('cli-name').value,
            doc: document.getElementById('cli-doc').value,
            phone: document.getElementById('cli-phone').value,
            email: document.getElementById('cli-email').value,
            visits: 0
        });
        this.closeAllModals();
        e.target.reset();
        this.showToast('Cliente guardado', 'success');
        this.renderClients();
    },

    handleVehicleSubmit(e) {
        e.preventDefault();
        mockData.vehicles.push({
            plate: document.getElementById('veh-plate').value.toUpperCase(),
            client: document.getElementById('veh-client').value,
            brand: document.getElementById('veh-brand').value,
            model: document.getElementById('veh-model').value,
            year: document.getElementById('veh-year').value,
            color: document.getElementById('veh-color').value
        });
        this.closeAllModals();
        e.target.reset();
        this.showToast('Vehículo guardado', 'success');
        this.renderVehicles();
    },

    handleServiceSubmit(e) {
        e.preventDefault();
        mockData.services.push({
            id: mockData.services.length + 1,
            name: document.getElementById('srv-name').value,
            price: parseFloat(document.getElementById('srv-price').value),
            icon: document.getElementById('srv-icon').value,
            desc: document.getElementById('srv-desc').value
        });
        this.closeAllModals();
        e.target.reset();
        this.showToast('Servicio guardado', 'success');
        this.renderServices();
    },

    handleWasherSubmit(e) {
        e.preventDefault();
        mockData.washers.push({
            name: document.getElementById('wsh-name').value,
            avatar: document.getElementById('wsh-avatar').value || 'https://i.pravatar.cc/150',
            status: 'Disponible',
            ordersToday: 0
        });
        this.closeAllModals();
        e.target.reset();
        this.showToast('Lavador guardado', 'success');
        this.renderWashers();
        this.renderDashboard();
    },

    handleInventorySubmit(e) {
        e.preventDefault();
        const stock = parseInt(document.getElementById('inv-stock').value);
        mockData.inventory.push({
            product: document.getElementById('inv-name').value,
            category: document.getElementById('inv-cat').value,
            stock: stock,
            unit: document.getElementById('inv-unit').value,
            price: parseFloat(document.getElementById('inv-price').value),
            status: getInvStatus(stock)
        });
        this.closeAllModals();
        e.target.reset();
        this.showToast('Producto guardado', 'success');
        this.renderInventory();
    },

    // --- Rendering --- //

    renderAll() {
        this.renderDashboard();
        this.renderOrders();
        this.renderClients();
        this.renderVehicles();
        this.renderServices();
        this.renderWashers();
        this.renderInventory();
        this.renderPayments();
    },

    renderDashboard() {
        const tbody = document.getElementById('dash-orders-tbody');
        tbody.innerHTML = mockData.orders.slice(0,3).map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.client}</td>
                <td>${o.plate}</td>
                <td>${o.service}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td>${formatMoney(o.total)}</td>
            </tr>
        `).join('');

        const washersList = document.getElementById('dash-washers-list');
        washersList.innerHTML = mockData.washers.map(w => `
            <div class="info-item" style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${w.avatar}" style="width:30px; height:30px; object-fit:cover; border-radius:50%;">
                    <span>${w.name}</span>
                </div>
                ${getStatusBadge(w.status)}
            </div>
        `).join('');
        
        // Update top KPIs (mock values updated simply)
        const pending = mockData.orders.filter(o => o.status === 'Pendiente').length;
        document.querySelector('.kpi-icon.warning + .kpi-details .kpi-value').innerText = pending;
    },

    renderOrders(searchTerm = '', statusFilter = '') {
        const tbody = document.getElementById('orders-tbody');
        let filtered = mockData.orders;
        
        if(searchTerm) {
            const s = searchTerm.toLowerCase();
            filtered = filtered.filter(o => o.id.toLowerCase().includes(s) || o.plate.toLowerCase().includes(s) || o.client.toLowerCase().includes(s));
        }
        if(statusFilter) {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        tbody.innerHTML = filtered.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.date}</td>
                <td>${o.client}<br><small class="text-muted">${o.plate}</small></td>
                <td>${o.service}</td>
                <td>${o.washer}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td><strong>${formatMoney(o.total)}</strong></td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-outline btn-sm" onclick="app.viewOrderDetail('${o.id}')" title="Ver Detalle"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="app.cancelOrder('${o.id}')" title="Cancelar"><i class="fa-solid fa-ban"></i></button>
                    </div>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="8" class="text-center py-4">No se encontraron resultados</td></tr>`;
    },

    renderClients(searchTerm = '') {
        const tbody = document.getElementById('clients-tbody');
        let filtered = mockData.clients;
        if(searchTerm) {
            const s = searchTerm.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || c.doc.includes(s));
        }
        tbody.innerHTML = filtered.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.doc}</td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td><span class="badge badge-gray">${c.visits}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm text-danger" onclick="app.deleteClient('${c.name}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderVehicles() {
        const tbody = document.getElementById('vehicles-tbody');
        tbody.innerHTML = mockData.vehicles.map(v => `
            <tr>
                <td><span class="badge badge-info">${v.plate}</span></td>
                <td>${v.brand}</td>
                <td>${v.model}</td>
                <td>${v.year}</td>
                <td>${v.color}</td>
                <td>${v.client}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="app.showToast('En desarrollo', 'warning')"><i class="fa-solid fa-pen"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderServices() {
        const grid = document.getElementById('services-grid');
        grid.innerHTML = mockData.services.map(s => `
            <div class="service-card">
                <i class="fa-solid ${s.icon} service-icon"></i>
                <h3>${s.name}</h3>
                <div class="service-price">${formatMoney(s.price)}</div>
                <p class="service-desc">${s.desc}</p>
                <button class="btn btn-outline" onclick="app.showToast('En desarrollo', 'warning')">Editar</button>
            </div>
        `).join('');
    },

    renderWashers() {
        const grid = document.getElementById('washers-grid');
        grid.innerHTML = mockData.washers.map(w => `
            <div class="washer-card">
                <img src="${w.avatar}" alt="${w.name}" class="washer-avatar">
                <div class="washer-info" style="flex:1;">
                    <h4>${w.name}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:5px;">Órdenes hoy: ${w.ordersToday}</p>
                    ${getStatusBadge(w.status)}
                </div>
                <button class="icon-btn" onclick="app.showToast('En desarrollo', 'warning')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
        `).join('');
    },

    renderInventory() {
        const tbody = document.getElementById('inventory-tbody');
        tbody.innerHTML = mockData.inventory.map(i => `
            <tr>
                <td><strong>${i.product}</strong></td>
                <td>${i.category}</td>
                <td>${i.stock}</td>
                <td>${i.unit}</td>
                <td>${formatMoney(i.price)}</td>
                <td>${getStatusBadge(i.status)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-outline btn-sm" onclick="app.showToast('Stock actualizado (+1)', 'success')"><i class="fa-solid fa-plus"></i></button>
                        <button class="btn btn-outline btn-sm" onclick="app.showToast('En desarrollo', 'warning')"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderPayments() {
        const tbody = document.getElementById('payments-tbody');
        tbody.innerHTML = mockData.payments.map(p => `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.order}</td>
                <td>${p.client}</td>
                <td>${p.date}</td>
                <td>${p.method}</td>
                <td><strong>${formatMoney(p.amount)}</strong></td>
                <td>${getStatusBadge(p.status)}</td>
            </tr>
        `).join('');
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
