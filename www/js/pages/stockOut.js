/**
 * 出库操作页
 */
window.Pages = window.Pages || {};
window.Pages['/stock-out'] = {
  _form: {
    date: '',
    warehouseId: '',
    partnerId: '',
    type: '销售出库',
    remark: '',
    items: []
  },

  render() {
    this._form = {
      date: UI.today(),
      warehouseId: '',
      partnerId: '',
      type: '销售出库',
      remark: '',
      items: []
    };

    const warehouses = Store.warehouses.getAll();
    if (warehouses.length > 0) {
      this._form.warehouseId = warehouses[0].id;
    }

    const whName = this._form.warehouseId
      ? (Store.warehouses.getById(this._form.warehouseId) || {}).name || ''
      : '';

    return `
      <div class="page">
        ${UI.header('出库操作')}
        <div class="page-content">
          <div class="card" style="margin-top:12px;">
            <div class="form-group">
              <span class="form-label">日期 <span class="required">*</span></span>
              <div class="form-value">
                <input class="form-input" id="f-date" type="date" value="${this._form.date}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">仓库 <span class="required">*</span></span>
              <div class="form-value" id="f-warehouse-btn" style="cursor:pointer;">
                <span class="form-select-value ${whName ? '' : 'placeholder'}" id="f-warehouse-text">
                  ${whName || '请选择仓库'}
                </span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">往来单位</span>
              <div class="form-value" id="f-partner-btn" style="cursor:pointer;">
                <span class="form-select-value placeholder" id="f-partner-text">请选择</span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">类型 <span class="required">*</span></span>
              <div class="form-value" id="f-type-btn" style="cursor:pointer;">
                <span class="form-select-value" id="f-type-text">${this._form.type}</span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">备注</span>
              <div class="form-value">
                <input class="form-input" id="f-remark" placeholder="请填写备注">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">附件图片</span>
              <div class="form-value">
                <span class="form-select-value placeholder">选择</span>
              </div>
            </div>
          </div>

          <div class="action-btns-row">
            <button class="action-btn" onclick="UI.toast('扫码功能开发中', 'info')">
              ${UI.icon('barcode')} 扫码选择商品
            </button>
            <button class="action-btn" onclick="Pages['/stock-out'].onSelectProduct()">
              ${UI.icon('search')} 手动选择商品
            </button>
          </div>

          <div id="selected-products"></div>

          <button class="btn-primary" onclick="Pages['/stock-out'].onSubmit()">提 交</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('f-warehouse-btn').onclick = async () => {
      const warehouses = Store.warehouses.getAll();
      const options = warehouses.map(w => ({ label: w.name, value: w.id }));
      const val = await UI.selectModal('选择仓库', options, this._form.warehouseId);
      if (val) {
        this._form.warehouseId = val;
        const wh = Store.warehouses.getById(val);
        const text = document.getElementById('f-warehouse-text');
        text.textContent = wh ? wh.name : '';
        text.className = 'form-select-value';
      }
    };

    document.getElementById('f-partner-btn').onclick = async () => {
      const partners = Store.partners.getAll();
      const options = [
        { label: '不选择', value: '' },
        ...partners.map(p => ({ label: p.name, value: p.id }))
      ];
      const val = await UI.selectModal('选择往来单位', options, this._form.partnerId);
      if (val !== null) {
        this._form.partnerId = val;
        const p = Store.partners.getById(val);
        const text = document.getElementById('f-partner-text');
        text.textContent = p ? p.name : '请选择';
        text.className = `form-select-value ${p ? '' : 'placeholder'}`;
      }
    };

    document.getElementById('f-type-btn').onclick = async () => {
      const options = [
        { label: '销售出库', value: '销售出库' },
        { label: '领用出库', value: '领用出库' },
        { label: '调拨出库', value: '调拨出库' },
        { label: '其他出库', value: '其他出库' }
      ];
      const val = await UI.selectModal('选择类型', options, this._form.type);
      if (val) {
        this._form.type = val;
        document.getElementById('f-type-text').textContent = val;
      }
    };
  },

  async onSelectProduct() {
    const products = Store.products.getAll();
    if (products.length === 0) {
      UI.toast('请先添加商品', 'error');
      return;
    }
    const categories = Store.categories.getAll();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });

    const options = products.map(p => ({
      label: `${p.name} (${catMap[p.categoryId] || '无分类'})`,
      value: p.id
    }));

    const val = await UI.selectModal('选择商品', options, '');
    if (val) {
      if (this._form.items.find(i => i.productId === val)) {
        UI.toast('该商品已添加', 'error');
        return;
      }
      this._form.items.push({ productId: val, quantity: 1, price: 0 });
      this.renderProducts();
    }
  },

  renderProducts() {
    const container = document.getElementById('selected-products');
    if (!container) return;

    container.innerHTML = this._form.items.map((item, idx) => {
      const p = Store.products.getById(item.productId);
      const name = p ? p.name : '未知商品';
      const unit = p ? (p.unit || '') : '';
      return `
        <div class="product-item-card">
          <div class="product-name">${name}</div>
          <div class="product-meta">
            <label>数量:</label>
            <input type="number" value="${item.quantity}" min="1"
                   onchange="Pages['/stock-out']._form.items[${idx}].quantity=parseInt(this.value)||1">
            <span style="font-size:12px;color:var(--text-secondary)">${unit}</span>
            <label style="margin-left:8px;">单价:</label>
            <input type="number" value="${item.price}" min="0" step="0.01"
                   onchange="Pages['/stock-out']._form.items[${idx}].price=parseFloat(this.value)||0">
          </div>
          <button class="btn-remove" onclick="Pages['/stock-out'].removeProduct(${idx})">×</button>
        </div>
      `;
    }).join('');
  },

  removeProduct(idx) {
    this._form.items.splice(idx, 1);
    this.renderProducts();
  },

  onSubmit() {
    const date = document.getElementById('f-date').value;
    if (!date) {
      UI.toast('请选择日期', 'error');
      return;
    }
    if (!this._form.warehouseId) {
      UI.toast('请选择仓库', 'error');
      return;
    }
    if (this._form.items.length === 0) {
      UI.toast('请添加商品', 'error');
      return;
    }

    const remark = document.getElementById('f-remark').value.trim();

    Store.stockOut.add({
      date,
      warehouseId: this._form.warehouseId,
      partnerId: this._form.partnerId,
      type: this._form.type,
      remark,
      images: [],
      items: this._form.items.map(i => ({
        productId: i.productId,
        quantity: parseInt(i.quantity) || 0,
        price: parseFloat(i.price) || 0
      })),
      operator: '管理员'
    });

    UI.toast('出库成功', 'success');
    Router.back();
  }
};
