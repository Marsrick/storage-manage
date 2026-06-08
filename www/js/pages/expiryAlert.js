/**
 * 过期预警页
 */
window.Pages = window.Pages || {};
window.Pages['/expiry-alert'] = {
  _filters: {
    keyword: '',
    warehouseId: '',
    categoryId: '',
    alertDays: 15
  },

  render() {
    const settings = Store.getSettings();
    this._filters = {
      keyword: '',
      warehouseId: '',
      categoryId: '',
      alertDays: settings.alertDays || 15
    };

    return `
      <div class="page">
        ${UI.header('过期预警')}

        <div class="search-bar">
          <div class="search-input-wrap" style="flex:1;">
            <span class="search-icon">${UI.icon('search')}</span>
            <input class="search-input" id="expiry-search" placeholder="搜索商品">
          </div>
          <div class="filter-item" id="expiry-warehouse">
            全部仓库 <span class="arrow">›</span>
          </div>
          <div class="filter-item" id="expiry-category">
            全部分类 <span class="arrow">›</span>
          </div>
        </div>

        <div class="alert-setting">
          [商品有效期小于<input type="number" class="alert-days-input" id="expiry-days" value="${this._filters.alertDays}" min="1">天预警]
          <a href="javascript:void(0)" onclick="Pages['/expiry-alert'].onSaveDays()">设置预警天数</a>
        </div>

        <div class="page-content" id="expiry-content">
          ${this.renderAlerts()}
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('expiry-warehouse').onclick = async () => {
      const warehouses = Store.warehouses.getAll();
      const options = [
        { label: '全部仓库', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.id }))
      ];
      const val = await UI.selectModal('选择仓库', options, this._filters.warehouseId);
      if (val !== null) {
        this._filters.warehouseId = val;
        const wh = Store.warehouses.getById(val);
        document.getElementById('expiry-warehouse').innerHTML =
          `${wh ? wh.name : '全部仓库'} <span class="arrow">›</span>`;
        this.refreshList();
      }
    };

    document.getElementById('expiry-category').onclick = async () => {
      const categories = Store.categories.getAll();
      const options = [
        { label: '全部分类', value: '' },
        ...categories.map(c => ({ label: c.name, value: c.id }))
      ];
      const val = await UI.selectModal('选择分类', options, this._filters.categoryId);
      if (val !== null) {
        this._filters.categoryId = val;
        const cat = Store.categories.getById(val);
        document.getElementById('expiry-category').innerHTML =
          `${cat ? cat.name : '全部分类'} <span class="arrow">›</span>`;
        this.refreshList();
      }
    };

    document.getElementById('expiry-search').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this._filters.keyword = e.target.value.trim();
        this.refreshList();
      }
    });
  },

  onSaveDays() {
    const days = parseInt(document.getElementById('expiry-days').value) || 15;
    this._filters.alertDays = days;
    const settings = Store.getSettings();
    settings.alertDays = days;
    Store.saveSettings(settings);
    UI.toast('预警天数已设置为 ' + days + ' 天', 'success');
    this.refreshList();
  },

  refreshList() {
    const container = document.getElementById('expiry-content');
    if (container) container.innerHTML = this.renderAlerts();
  },

  renderAlerts() {
    const alerts = Store.getExpiryAlerts(this._filters);
    if (alerts.length === 0) {
      return UI.empty('暂无过期预警商品');
    }

    return `
      <div style="padding:12px 0;">
        ${alerts.map(item => `
          <div class="inventory-item">
            <div class="item-header">
              <div class="item-icon" style="background:var(--danger-bg);color:var(--danger);">⏰</div>
              <div class="item-info">
                <div class="item-name">${item.productName}</div>
                <div class="item-category">
                  分类: ${item.categoryName || '无'} | 规格: ${item.specName || '-'} | 仓库: ${item.warehouseName}
                  ${item.itemNo ? ` | 货号: ${item.itemNo}` : ''}
                  ${item.manufacturer ? ` | 厂家: ${item.manufacturer}` : ''}
                </div>
              </div>
            </div>
            <div class="item-data">
              <div class="data-cell">库存: <span class="value">${item.quantity}</span> ${item.productUnit}</div>
              <div class="data-cell">有效期至: <span class="value">${item.expiryDate || '-'}</span></div>
              <div class="data-cell" style="grid-column: span 2;">
                状态: ${item.expiryDays <= 0 
                  ? `<span class="value" style="color:var(--danger);font-weight:600;">已过期 ${Math.abs(item.expiryDays)} 天</span>`
                  : `剩余 <span class="value" style="color:var(--warning);font-weight:600;">${item.expiryDays} 天</span>`
                }
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
