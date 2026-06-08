/**
 * 入库记录页
 */
window.Pages = window.Pages || {};
window.Pages['/stock-in-records'] = {
  _filters: {},

  render() {
    const thirtyDaysAgo = UI.daysAgo(30);
    this._filters = {
      operator: '',
      warehouseId: '',
      startDate: thirtyDaysAgo,
      endDate: UI.today()
    };

    return `
      <div class="page">
        ${UI.header('入库记录')}
        <div class="filter-bar">
          <div class="filter-row">
            <div class="filter-item" id="filter-operator">
              操作人 <span class="arrow">▼</span>
            </div>
            <div class="filter-input-wrap">
              <span class="search-icon">${UI.icon('search')}</span>
              <input class="filter-search" id="search-operator" placeholder="搜索操作人">
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-item" id="filter-warehouse">
              仓库: 全部仓库 <span class="arrow">›</span>
            </div>
          </div>
          <div class="filter-row">
            <span style="font-size:13px;color:var(--text-secondary);white-space:nowrap;">操作时间</span>
            <div class="filter-date-range">
              <input type="text" class="filter-date" id="filter-start" value="${thirtyDaysAgo}" readonly style="cursor:pointer;">
              <span class="filter-date-sep">~</span>
              <input type="text" class="filter-date" id="filter-end" value="${UI.today()}" readonly style="cursor:pointer;">
            </div>
            <button class="btn-query" onclick="Pages['/stock-in-records'].doQuery()">查询</button>
          </div>
        </div>
        <div class="page-content has-footer-btn" id="records-content">
          ${this.renderRecords()}
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/stock-in-records'].onExport()">导出以上入库记录</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('filter-warehouse').onclick = async () => {
      const warehouses = Store.warehouses.getAll();
      const options = [
        { label: '全部仓库', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.id }))
      ];
      const val = await UI.selectModal('选择仓库', options, this._filters.warehouseId);
      if (val !== null) {
        this._filters.warehouseId = val;
        const wh = Store.warehouses.getById(val);
        document.getElementById('filter-warehouse').innerHTML =
          `仓库: ${wh ? wh.name : '全部仓库'} <span class="arrow">›</span>`;
        this.doQuery();
      }
    };

    document.getElementById('filter-start').onclick = async (e) => {
      const val = await UI.datePickerModal('选择开始日期', e.target.value);
      if (val) {
        e.target.value = val;
        this.doQuery();
      }
    };

    document.getElementById('filter-end').onclick = async (e) => {
      const val = await UI.datePickerModal('选择结束日期', e.target.value);
      if (val) {
        e.target.value = val;
        this.doQuery();
      }
    };

    document.getElementById('search-operator').addEventListener('input', (e) => {
      this._filters.operator = e.target.value.trim();
    });
  },

  doQuery() {
    this._filters.startDate = document.getElementById('filter-start').value;
    this._filters.endDate = document.getElementById('filter-end').value;
    const opInput = document.getElementById('search-operator');
    if (opInput) this._filters.operator = opInput.value.trim();

    const container = document.getElementById('records-content');
    if (container) {
      container.innerHTML = this.renderRecords();
    }
  },

  renderRecords() {
    const orders = Store.stockIn.query(this._filters);
    if (orders.length === 0) {
      return UI.empty('暂无入库记录');
    }

    const records = [];
    orders.forEach(order => {
      const wh = Store.warehouses.getById(order.warehouseId);
      (order.items || []).forEach(item => {
        const product = Store.products.getById(item.productId);
        const category = product ? Store.categories.getById(product.categoryId) : null;
        let specName = '';
        if (product && product.specs) {
          const spec = product.specs.find(sp => sp.id === item.specId);
          if (spec) specName = spec.name;
        }
        records.push({
          orderId: order.id,
          productName: product ? product.name : '未知商品',
          categoryName: category ? category.name : '',
          specName: specName,
          unit: product ? (product.unit || '') : '',
          quantity: item.quantity,
          price: item.price,
          total: (item.quantity || 0) * (item.price || 0),
          type: order.type,
          date: order.date,
          time: UI.formatDateTime(order.createdAt),
          warehouseName: wh ? wh.name : '',
          images: order.images || []
        });
      });
    });

    return `
      <div class="record-list" style="padding-top:12px;">
        ${records.map(r => `
          <div class="record-item">
            <div class="record-item-header">
              <div class="record-item-icon">📥</div>
              <div class="record-item-info">
                <div class="product-name">${r.productName}</div>
                <div class="product-category">分类: ${r.categoryName || '无'}${r.specName ? ` | 规格: ${r.specName}` : ''}</div>
                <div class="record-meta">
                  <span class="quantity">数量 ${r.quantity}</span>
                  <span class="price">¥ ${r.total.toFixed(2)}</span>
                </div>
                <div class="record-unit" style="font-size:11px;color:var(--text-light);">
                  ${r.unit ? `单位: ${r.unit} | ` : ''}时间:${r.time}
                </div>
                ${r.images && r.images.length > 0 ? `
                  <div class="record-item-images" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">
                    ${r.images.map(img => `
                      <img src="${img}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--border); cursor:pointer;" onclick="UI.previewImage('${img}', event)">
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
            <span class="record-tag">${r.type}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  onExport() {
    const orders = Store.stockIn.query(this._filters);
    const rows = [];
    orders.forEach(order => {
      const wh = Store.warehouses.getById(order.warehouseId);
      const partner = Store.partners.getById(order.partnerId);
      (order.items || []).forEach(item => {
        const product = Store.products.getById(item.productId);
        const category = product ? Store.categories.getById(product.categoryId) : null;
        let specName = '';
        if (product && product.specs) {
          const spec = product.specs.find(sp => sp.id === item.specId);
          if (spec) specName = spec.name;
        }
        rows.push([
          order.date,
          wh ? wh.name : '',
          partner ? partner.name : '',
          order.type,
          product ? product.name : '',
          category ? category.name : '',
          specName,
          product ? (product.unit || '') : '',
          item.quantity,
          item.price,
          ((item.quantity || 0) * (item.price || 0)).toFixed(2),
          order.operator || '',
          UI.formatDateTime(order.createdAt)
        ]);
      });
    });

    UI.exportCSV(
      `入库记录_${UI.today()}.csv`,
      ['日期', '仓库', '往来单位', '类型', '商品名称', '分类', '规格', '单位', '数量', '单价', '金额', '操作人', '创建时间'],
      rows
    );
  }
};
