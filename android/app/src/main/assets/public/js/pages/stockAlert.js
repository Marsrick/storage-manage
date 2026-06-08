/**
 * 库存预警页
 */
window.Pages = window.Pages || {};
window.Pages['/stock-alert'] = {
  _filters: {
    keyword: '',
    warehouseId: '',
    categoryId: ''
  },

  render() {
    this._filters = { keyword: '', warehouseId: '', categoryId: '' };
    const categories = Store.categories.getAll();

    return `
      <div class="page">
        ${UI.header('库存预警')}

        <div class="search-bar">
          <div class="search-input-wrap" style="flex:1;">
            <span class="search-icon">${UI.icon('search')}</span>
            <input class="search-input" id="alert-search" placeholder="搜索商品">
          </div>
          <div class="filter-item" id="alert-warehouse">
            全部仓库 <span class="arrow">›</span>
          </div>
          <div class="filter-item" id="alert-category">
            全部分类 <span class="arrow">›</span>
          </div>
        </div>

        <div class="page-content" id="alert-content">
          ${this.renderAlerts()}
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('alert-warehouse').onclick = async () => {
      const warehouses = Store.warehouses.getAll();
      const options = [
        { label: '全部仓库', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.id }))
      ];
      const val = await UI.selectModal('选择仓库', options, this._filters.warehouseId);
      if (val !== null) {
        this._filters.warehouseId = val;
        const wh = Store.warehouses.getById(val);
        document.getElementById('alert-warehouse').innerHTML =
          `${wh ? wh.name : '全部仓库'} <span class="arrow">›</span>`;
        this.refreshList();
      }
    };

    document.getElementById('alert-category').onclick = async () => {
      const categories = Store.categories.getAll();
      const options = [
        { label: '全部分类', value: '' },
        ...categories.map(c => ({ label: c.name, value: c.id }))
      ];
      const val = await UI.selectModal('选择分类', options, this._filters.categoryId);
      if (val !== null) {
        this._filters.categoryId = val;
        const cat = Store.categories.getById(val);
        document.getElementById('alert-category').innerHTML =
          `${cat ? cat.name : '全部分类'} <span class="arrow">›</span>`;
        this.refreshList();
      }
    };

    document.getElementById('alert-search').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this._filters.keyword = e.target.value.trim();
        this.refreshList();
      }
    });
  },

  refreshList() {
    const container = document.getElementById('alert-content');
    if (container) container.innerHTML = this.renderAlerts();
  },

  renderAlerts() {
    const alerts = Store.getStockAlerts(this._filters);
    if (alerts.length === 0) {
      return UI.empty('暂无库存预警');
    }

    return `
      <div style="padding:12px 0;">
        ${alerts.map(item => `
          <div class="inventory-item">
            <div class="item-header">
              <div class="item-icon" style="background:var(--warning-bg);color:var(--warning);">⚠️</div>
              <div class="item-info">
                <div class="item-name">${item.productName}</div>
                <div class="item-category">分类: ${item.categoryName || '无'} | 规格: ${item.specName || '-'} | 仓库: ${item.warehouseName}</div>
              </div>
            </div>
            <div class="item-data">
              <div class="data-cell">当前库存: <span class="value warning">${item.quantity}</span> ${item.productUnit}</div>
              <div class="data-cell">安全库存: <span class="value">${item.minStock}</span></div>
              <div class="data-cell">缺口: <span class="value warning">${item.minStock - item.quantity}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
