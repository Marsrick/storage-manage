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
    images: [],
    items: []
  },

  render() {
    this._form = {
      date: UI.today(),
      warehouseId: '',
      partnerId: '',
      type: '销售出库',
      remark: '',
      images: [],
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
            <div class="form-group" style="flex-direction: column; align-items: stretch; height: auto;">
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="form-label">附件图片</span>
                <div class="form-value" id="f-images-btn" style="cursor:pointer;">
                  <span class="form-select-value placeholder" id="f-images-text">选择</span>
                  <span class="form-arrow">›</span>
                </div>
              </div>
              <input type="file" id="f-images-input" accept="image/*" multiple style="display: none;">
              <div id="f-images-previews" style="display:none; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; width: 100%;"></div>
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
        this.renderProducts();
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

    const imgBtn = document.getElementById('f-images-btn');
    const imgInput = document.getElementById('f-images-input');
    if (imgBtn && imgInput) {
      imgBtn.onclick = () => imgInput.click();
      imgInput.onchange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        let loadedCount = 0;
        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            this._form.images.push(base64);
            loadedCount++;
            if (loadedCount === files.length) {
              this.renderImages();
              imgInput.value = '';
            }
          };
          reader.readAsDataURL(file);
        });
      };
    }
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

    // 获取当前选择的仓库的库存情况
    const warehouseId = this._form.warehouseId;
    const invList = Store.getInventory({ warehouseId, showZero: true });
    const stockMap = {};
    invList.forEach(item => {
      stockMap[item.productId] = item.quantity;
    });

    const options = products.map(p => {
      const stock = stockMap[p.id] || 0;
      const unit = p.unit || '';
      return {
        label: `
          <div class="product-select-item">
            <div class="product-select-name">${p.name}</div>
            <div class="product-select-meta">
              <span class="product-select-cat">${catMap[p.categoryId] || '无分类'}</span>
              <span class="product-select-stock">库存: <strong class="stock-highlight">${stock}</strong> ${unit}</span>
            </div>
          </div>
        `,
        value: p.id,
        categoryId: p.categoryId || '',
        categoryName: catMap[p.categoryId] || '无分类',
        searchText: `${p.name} ${p.spec || ''} ${p.manufacturer || ''} ${p.barcode || ''} ${p.itemNo || ''} ${catMap[p.categoryId] || ''}`.toLowerCase()
      };
    });

    const currentSelectedIds = this._form.items.map(i => i.productId);

    const vals = await UI.multiSelectModal('选择商品', options, currentSelectedIds);
    if (vals) {
      const oldItemsMap = {};
      this._form.items.forEach(item => {
        oldItemsMap[item.productId] = item;
      });

      this._form.items = vals.map(val => {
        if (oldItemsMap[val]) {
          return oldItemsMap[val];
        } else {
          return { productId: val, quantity: 1, price: 0 };
        }
      });

      this.renderProducts();
    }
  },

  renderProducts() {
    const container = document.getElementById('selected-products');
    if (!container) return;

    const warehouseId = this._form.warehouseId;
    const invList = Store.getInventory({ warehouseId, showZero: true });
    const stockMap = {};
    invList.forEach(item => {
      stockMap[item.productId] = item.quantity;
    });

    container.innerHTML = this._form.items.map((item, idx) => {
      const p = Store.products.getById(item.productId);
      const name = p ? p.name : '未知商品';
      const unit = p ? (p.unit || '') : '';
      const stock = p ? (stockMap[item.productId] || 0) : 0;
      return `
        <div class="product-item-card">
          <div class="product-name">${name}</div>
          <div class="product-stock" style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">
            剩余库存量: <span class="stock-badge-selected">${stock} ${unit}</span>
          </div>
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
      images: this._form.images || [],
      items: this._form.items.map(i => ({
        productId: i.productId,
        quantity: parseInt(i.quantity) || 0,
        price: parseFloat(i.price) || 0
      })),
      operator: '管理员'
    });

    UI.toast('出库成功', 'success');
    Router.back();
  },

  renderImages() {
    const previews = document.getElementById('f-images-previews');
    const textEl = document.getElementById('f-images-text');
    if (!previews || !textEl) return;

    if (this._form.images.length === 0) {
      previews.style.display = 'none';
      previews.innerHTML = '';
      textEl.textContent = '选择';
      textEl.classList.add('placeholder');
      return;
    }

    textEl.textContent = `已选 ${this._form.images.length} 张`;
    textEl.classList.remove('placeholder');
    previews.style.display = 'grid';
    previews.innerHTML = this._form.images.map((img, idx) => `
      <div class="image-preview-wrapper" style="position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); background: var(--bg);">
        <img src="${img}" style="width:100%; height:100%; object-fit:cover; cursor:pointer;" onclick="UI.previewImage('${img}', event)">
        <div class="image-preview-remove" style="position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;" onclick="Pages['/stock-out'].removeImage(${idx}, event)">&times;</div>
      </div>
    `).join('');
  },

  removeImage(idx, event) {
    if (event) event.stopPropagation();
    this._form.images.splice(idx, 1);
    this.renderImages();
  }
};
