/**
 * 库存查询页
 */
window.Pages = window.Pages || {};
window.Pages['/inventory'] = {
  _filters: {
    keyword: '',
    warehouseId: '',
    categoryId: '',
    showZero: false
  },

  render() {
    this._filters = { keyword: '', warehouseId: '', categoryId: '', showZero: false };
    const categories = Store.categories.getAll();

    return `
      <div class="page">
        ${UI.header('库存查询')}

        <!-- 搜索栏 -->
        <div class="search-bar">
          <div class="filter-item" style="font-size:12px;" id="inv-search-mode">
            扫码 &nbsp; 商品名 <span class="arrow">▼</span>
          </div>
          <div class="search-input-wrap">
            <span class="search-icon">${UI.icon('search')}</span>
            <input class="search-input" id="inv-search" placeholder="搜索商品名称">
          </div>
          <button class="btn-search" onclick="Pages['/inventory'].doSearch()">搜索</button>
        </div>

        <!-- 仓库筛选 -->
        <div style="padding:8px 16px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <div class="filter-item" id="inv-warehouse-filter">
            全部仓库 <span class="arrow">›</span>
          </div>
          <button class="toggle-btn ${this._filters.showZero ? 'active' : ''}" id="inv-show-zero"
                  onclick="Pages['/inventory'].toggleShowZero()">显示0库存</button>
        </div>

        <!-- 分类Tab -->
        <div class="category-tabs" id="inv-category-tabs">
          <div class="category-tab active" data-id="" onclick="Pages['/inventory'].selectCategory('')">全部</div>
          ${categories.map(c => `
            <div class="category-tab" data-id="${c.id}" onclick="Pages['/inventory'].selectCategory('${c.id}')">${c.name}</div>
          `).join('')}
        </div>

        <div class="page-content has-footer-btn" id="inv-content">
          ${this.renderInventory()}
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/inventory'].onExport()">导出该仓库库存报表Excel</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('inv-warehouse-filter').onclick = async () => {
      const warehouses = Store.warehouses.getAll();
      const options = [
        { label: '全部仓库', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.id }))
      ];
      const val = await UI.selectModal('选择仓库', options, this._filters.warehouseId);
      if (val !== null) {
        this._filters.warehouseId = val;
        const wh = Store.warehouses.getById(val);
        document.getElementById('inv-warehouse-filter').innerHTML =
          `${wh ? wh.name : '全部仓库'} <span class="arrow">›</span>`;
        this.refreshList();
      }
    };

    document.getElementById('inv-search').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.doSearch();
    });
  },

  doSearch() {
    this._filters.keyword = document.getElementById('inv-search').value.trim();
    this.refreshList();
  },

  selectCategory(catId) {
    this._filters.categoryId = catId;
    // 更新Tab样式
    document.querySelectorAll('#inv-category-tabs .category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.id === catId);
    });
    this.refreshList();
  },

  toggleShowZero() {
    this._filters.showZero = !this._filters.showZero;
    const btn = document.getElementById('inv-show-zero');
    btn.classList.toggle('active', this._filters.showZero);
    this.refreshList();
  },

  refreshList() {
    const container = document.getElementById('inv-content');
    if (container) container.innerHTML = this.renderInventory();
  },

  renderInventory() {
    const items = Store.getInventory(this._filters);
    if (items.length === 0) {
      return UI.empty('暂无库存数据');
    }

    // 合并同一商品在所有仓库的数据
    const merged = {};
    items.forEach(i => {
      if (!merged[i.productId]) {
        merged[i.productId] = {
          ...i,
          totalQuantity: 0,
          totalValue: 0,
          warehouses: []
        };
      }
      merged[i.productId].totalQuantity += i.quantity;
      merged[i.productId].totalValue += i.inventoryValue;
      merged[i.productId].warehouses.push({ name: i.warehouseName, qty: i.quantity });
    });

    // 如果选了特定仓库就不合并
    const displayItems = this._filters.warehouseId ? items : Object.values(merged);

    return `
      <div style="padding-top:12px;">
        ${displayItems.map(item => {
          const qty = this._filters.warehouseId ? item.quantity : item.totalQuantity;
          const val = this._filters.warehouseId ? item.inventoryValue : item.totalValue;
          const distText = !this._filters.warehouseId && item.warehouses
            ? item.warehouses.map(w => `${w.name}: ${w.qty}`).join(', ')
            : '';

          return `
            <div class="inventory-item">
              <div class="item-header">
                <div class="item-icon">${(item.productName || '?')[0]}</div>
                <div class="item-info">
                  <div class="item-name">${item.productName}</div>
                  <div class="item-category">
                    分类: ${item.categoryName || '无'}
                    ${item.itemNo ? ` | 货号: ${item.itemNo}` : ''}
                    ${item.manufacturer ? ` | 厂家: ${item.manufacturer}` : ''}
                  </div>
                </div>
                <div class="item-right">
                  <div>库存: <span style="font-size:12px;">${item.productUnit || ''}</span></div>
                </div>
              </div>
              <div class="item-data">
                <div class="data-cell">库存: <span class="value stock">${qty}</span> ${item.productUnit}</div>
                <div class="data-cell">成本均价: <span class="value">${item.avgCost.toFixed(2)}</span></div>
                ${item.expiryDate ? `<div class="data-cell">有效期至: <span class="value">${item.expiryDate}</span></div>` : ''}
                ${distText ? `<div class="data-cell" style="grid-column: span 2;">库存分布: <span class="value">${distText}</span></div>` : ''}
              </div>
              <div class="stock-value-tag">库存额:${val.toFixed(2)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  onExport() {
    const items = Store.getInventory(this._filters);
    const rows = items.map(i => [
      i.productName,
      i.categoryName,
      i.itemNo || '',
      i.manufacturer || '',
      i.productUnit,
      i.warehouseName,
      i.quantity,
      i.avgCost.toFixed(2),
      i.inventoryValue.toFixed(2),
      i.minStock,
      i.expiryDate || ''
    ]);

    UI.exportCSV(
      `库存报表_${UI.today()}.csv`,
      ['商品名称', '分类', '货号', '厂家', '单位', '仓库', '库存数量', '成本均价', '库存额', '安全库存', '有效期截至'],
      rows
    );
  }
};
