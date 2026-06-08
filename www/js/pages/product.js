/**
 * 商品管理页
 */
window.Pages = window.Pages || {};
window.Pages['/product'] = {
  render() {
    const products = Store.products.getAll();
    const categories = Store.categories.getAll();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });

    return `
      <div class="page">
        ${UI.header('商品管理')}
        <div class="page-content has-footer-btn">
          <div style="padding-top:12px;">
            ${products.length === 0 ? UI.empty('暂无商品，请添加') : ''}
            <div class="manage-list">
              ${products.map(p => {
                const specNames = (p.specs || []).map(s => s.name).join(', ') || '-';
                const manufacturers = [...new Set((p.specs || []).map(s => s.manufacturer).filter(Boolean))].join(', ') || '-';
                return `
                  <div class="manage-item" data-id="${p.id}" style="flex-direction:column;align-items:flex-start;gap:4px;position:relative;padding-right:40px;">
                    <span class="item-name">${p.name}</span>
                    <span style="font-size:12px;color:var(--text-secondary);">
                      分类: ${catMap[p.categoryId] || '无'} | 单位: ${p.unit || '-'}
                    </span>
                    <span style="font-size:12px;color:var(--text-secondary);">
                      规格: ${specNames}
                    </span>
                    <span style="font-size:12px;color:var(--text-secondary);">
                      厂家: ${manufacturers}
                    </span>
                    <button class="btn-more" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);"
                            onclick="Pages['/product'].onMore('${p.id}')">
                      ${UI.icon('more')}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/product'].onAdd()">新 增 商 品</button>
        </div>
      </div>
    `;
  },

  onAdd() {
    Router.navigate('/product-edit');
  },

  async onMore(id) {
    const idx = await UI.actionSheet([
      { label: '编辑' },
      { label: '删除', danger: true }
    ]);
    if (idx === 0) {
      Router.navigate('/product-edit?id=' + id);
    } else if (idx === 1) {
      const ok = await UI.confirm('确定删除该商品？');
      if (ok) {
        Store.products.remove(id);
        UI.toast('删除成功', 'success');
        Router.refresh();
      }
    }
  }
};

// 商品编辑/新增页
window.Pages['/product-edit'] = {
  _form: {},

  render() {
    const params = Router.getParams();
    const isEdit = !!params.id;
    const product = isEdit ? Store.products.getById(params.id) : null;

    if (!this._form.name && !this._form.specs) {
      this._form = product ? JSON.parse(JSON.stringify(product)) : {
        name: '', categoryId: '', unit: '', specs: []
      };
      if (!this._form.specs || this._form.specs.length === 0) {
        this._form.specs = [{
          id: 'spec_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
          name: '', image: '', barcode: '', manufacturer: '', itemNo: '',
          inPrice: '', outPrice: '', minStock: '', expiryDate: '', remark: ''
        }];
      }
    }

    const catName = this._form.categoryId
      ? (Store.categories.getById(this._form.categoryId) || {}).name || ''
      : '';

    return `
      <div class="page">
        ${UI.header(isEdit ? '编辑商品' : '新增商品')}
        <div class="page-content has-footer-btn">
          <div class="card" style="margin-top:12px;">
            <div class="form-group">
              <span class="form-label">商品名称 <span class="required">*</span></span>
              <div class="form-value">
                <input class="form-input" id="f-name" placeholder="请输入商品名称" value="${this._form.name}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">商品分类</span>
              <div class="form-value" id="f-category-btn" style="cursor:pointer;">
                <span class="form-select-value ${catName ? '' : 'placeholder'}" id="f-category-text">
                  ${catName || '请选择分类'}
                </span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">商品单位</span>
              <div class="form-value">
                <input class="form-input" id="f-unit" placeholder="如: 瓶、箱、个" value="${this._form.unit || ''}">
              </div>
            </div>
          </div>

          <!-- 规格列表 -->
          <div id="specs-container">
            ${this._form.specs.map((s, idx) => `
              <div class="spec-card" data-idx="${idx}">
                <div class="spec-section-header">
                  <span>规格区块 ${idx + 1}</span>
                  ${this._form.specs.length > 1 ? `
                    <span class="btn-delete-spec" onclick="Pages['/product-edit'].onDeleteSpec(${idx})">
                      删除规格
                    </span>
                  ` : ''}
                </div>
                <div class="form-group">
                  <span class="form-label">规格名称 <span class="required">*</span></span>
                  <div class="form-value">
                    <input class="form-input f-spec-name" placeholder="如: 500ml/瓶" value="${s.name || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">厂家</span>
                  <div class="form-value">
                    <input class="form-input f-spec-manufacturer" placeholder="请输入厂家" value="${s.manufacturer || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">货号</span>
                  <div class="form-value">
                    <input class="form-input f-spec-itemNo" placeholder="请输入货号" value="${s.itemNo || ''}">
                  </div>
                </div>
                <div class="form-group" style="flex-direction: column; align-items: stretch; height: auto;">
                  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span class="form-label">商品图片</span>
                    <div class="form-value" onclick="Pages['/product-edit'].onSelectSpecImage(${idx})" style="cursor:pointer;">
                      <span class="form-select-value ${s.image ? '' : 'placeholder'} img-text">${s.image ? '已选' : '选择'}</span>
                      <span class="form-arrow">›</span>
                    </div>
                  </div>
                  <input type="file" class="f-spec-image-input" accept="image/*" style="display: none;" onchange="Pages['/product-edit'].onSpecImageChange(${idx}, this)">
                  <div class="img-preview" style="display:${s.image ? 'grid' : 'none'}; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; width: 100%;">
                    ${s.image ? `
                      <div class="image-preview-wrapper" style="position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); background: var(--bg);">
                        <img src="${s.image}" style="width:100%; height:100%; object-fit:cover; cursor:pointer;" onclick="UI.previewImage('${s.image}', event)">
                        <div class="image-preview-remove" style="position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;" onclick="Pages['/product-edit'].onRemoveSpecImage(${idx}, event)">&times;</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">条码/二维码</span>
                  <div class="form-value">
                    <input class="form-input f-spec-barcode" placeholder="留空会自动生成" value="${s.barcode || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">入库价格</span>
                  <div class="form-value">
                    <input class="form-input f-spec-inPrice" type="number" placeholder="请输入入库价格" value="${s.inPrice || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">出库价格</span>
                  <div class="form-value">
                    <input class="form-input f-spec-outPrice" type="number" placeholder="请输入出库价格" value="${s.outPrice || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">库存预警</span>
                  <div class="form-value">
                    <input class="form-input f-spec-minStock" type="number" placeholder="请输入最低库存数量" value="${s.minStock || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">有效期截至</span>
                  <div class="form-value" onclick="Pages['/product-edit'].onSelectExpiryDate(${idx})" style="cursor:pointer;">
                    <span class="form-select-value ${s.expiryDate ? '' : 'placeholder'} expiry-text">${s.expiryDate || '请选择商品有效期到期时间'}</span>
                    <span class="form-arrow">›</span>
                  </div>
                </div>
                <div class="form-group">
                  <span class="form-label">备注</span>
                  <div class="form-value">
                    <input class="form-input f-spec-remark" placeholder="请填写备注, 如: 货架号、自定义信息" value="${s.remark || ''}">
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="btn-add-spec-wrap">
            <button class="btn-add-spec" onclick="Pages['/product-edit'].onAddSpec()">
              ${UI.icon('plus')} 添加规格
            </button>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/product-edit'].onSubmit()">提 交</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('f-category-btn').onclick = async () => {
      const categories = Store.categories.getAll();
      const options = [
        { label: '不选择', value: '' },
        ...categories.map(c => ({ label: c.name, value: c.id }))
      ];
      const val = await UI.selectModal('选择分类', options, this._form.categoryId);
      if (val !== null) {
        this._form.categoryId = val;
        const text = document.getElementById('f-category-text');
        const cat = Store.categories.getById(val);
        text.textContent = cat ? cat.name : '请选择分类';
        text.className = `form-select-value ${cat ? '' : 'placeholder'}`;
      }
    };
  },

  syncFormState() {
    this._form.name = document.getElementById('f-name').value.trim();
    this._form.unit = document.getElementById('f-unit').value.trim();
    
    const cards = document.querySelectorAll('.spec-card');
    cards.forEach(card => {
      const idx = parseInt(card.dataset.idx);
      const spec = this._form.specs[idx];
      if (spec) {
        spec.name = card.querySelector('.f-spec-name').value.trim();
        spec.manufacturer = card.querySelector('.f-spec-manufacturer').value.trim();
        spec.itemNo = card.querySelector('.f-spec-itemNo').value.trim();
        spec.barcode = card.querySelector('.f-spec-barcode').value.trim();
        spec.inPrice = card.querySelector('.f-spec-inPrice').value.trim();
        spec.outPrice = card.querySelector('.f-spec-outPrice').value.trim();
        spec.minStock = card.querySelector('.f-spec-minStock').value.trim();
        spec.remark = card.querySelector('.f-spec-remark').value.trim();
      }
    });
  },

  onAddSpec() {
    this.syncFormState();
    this._form.specs.push({
      id: 'spec_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name: '', image: '', barcode: '', manufacturer: '', itemNo: '',
      inPrice: '', outPrice: '', minStock: '', expiryDate: '', remark: ''
    });
    Router.refresh();
  },

  onDeleteSpec(idx) {
    this.syncFormState();
    this._form.specs.splice(idx, 1);
    Router.refresh();
  },

  onSelectSpecImage(idx) {
    const cards = document.querySelectorAll('.spec-card');
    const card = cards[idx];
    if (card) {
      card.querySelector('.f-spec-image-input').click();
    }
  },

  onSpecImageChange(idx, input) {
    this.syncFormState();
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this._form.specs[idx].image = e.target.result;
      Router.refresh();
    };
    reader.readAsDataURL(file);
  },

  onRemoveSpecImage(idx, event) {
    if (event) event.stopPropagation();
    this.syncFormState();
    this._form.specs[idx].image = '';
    Router.refresh();
  },

  async onSelectExpiryDate(idx) {
    this.syncFormState();
    const spec = this._form.specs[idx];
    const val = await UI.datePickerModal('选择有效期截止', spec.expiryDate);
    if (val !== null) {
      spec.expiryDate = val;
      Router.refresh();
    }
  },

  onSubmit() {
    this.syncFormState();
    const name = this._form.name;
    if (!name) {
      UI.toast('请输入商品名称', 'error');
      return;
    }
    
    let invalidSpec = false;
    this._form.specs.forEach((s, i) => {
      if (!s.name) {
        UI.toast(`请输入规格区块 ${i + 1} 的规格名称`, 'error');
        invalidSpec = true;
      }
    });
    if (invalidSpec) return;

    const data = {
      name,
      categoryId: this._form.categoryId || '',
      unit: this._form.unit || '',
      specs: this._form.specs.map(s => ({
        id: s.id,
        name: s.name,
        image: s.image || '',
        barcode: s.barcode || '',
        manufacturer: s.manufacturer || '',
        itemNo: s.itemNo || '',
        inPrice: parseFloat(s.inPrice) || 0,
        outPrice: parseFloat(s.outPrice) || 0,
        minStock: parseInt(s.minStock) || 0,
        expiryDate: s.expiryDate || '',
        remark: s.remark || ''
      }))
    };

    const params = Router.getParams();
    if (params.id) {
      Store.products.update(params.id, data);
      UI.toast('修改成功', 'success');
    } else {
      Store.products.add(data);
      UI.toast('添加成功', 'success');
    }

    // Reset local state
    this._form = {};
    Router.back();
  }
};
